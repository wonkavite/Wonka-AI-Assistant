from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Databases.database import engine, Base

from Routes.auth_routes import router as auth_router
from Routes.chat_routes import router as chat_router


# --------------------------------------------------
# Create Database Tables
# --------------------------------------------------

Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# Create FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="Wonka AI Assistant API",
    description="Backend API for Wonka AI Assistant",
    version="1.0.0"
)

#add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------------------
# Register Routers
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(chat_router)


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Wonka AI Assistant API is running"
    }