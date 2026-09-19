# Wonka-AI-Assistant
Wonka AI Assistant helps Tech enthusiasts and students eager to learn Tech to break into the Tech industry. The assistant guides students by providing most demanding Tech skills and Tech career advice.

## Deployment configuration

Set these variables in the backend hosting environment:

- `DATABASE_URL`: PostgreSQL connection string
- `Groq_API_KEY`: Groq API key
- `MODEL_NAME`: Groq model name
- `CORS_ORIGINS`: comma-separated frontend origins

Set `VITE_API_BASE_URL` in the frontend build environment to the deployed backend URL. Do not commit `.env` files or API keys.

Install and run the backend with:

```powershell
pip install -r requirements.txt
uvicorn Main_server.server:app --host 0.0.0.0 --port $env:PORT
```

Build the frontend with:

```powershell
npm install
npm run build
```
