from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Databases.database import get_db
from Databases.crud import get_user_by_email, get_user_by_username

from Schemas.auth import UserRegister, UserLogin

from Authentication.auth import register_user, login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# --------------------------------------------------
# Register
# --------------------------------------------------

@router.post("/register")
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    # Check whether email already exists
    existing_email = get_user_by_email(
        db,
        user_data.email
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Check whether username already exists
    existing_username = get_user_by_username(
        db,
        user_data.username
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    user = register_user(
        db,
        user_data
    )

    return {
        "message": "User registered successfully",
        "user_id": user.id
    }


# --------------------------------------------------
# Login
# --------------------------------------------------

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = login_user(
        db,
        user_data
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user_id": user.id
    }