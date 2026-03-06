#!/bin/bash

# Initialize Python project for the backend
cd "$(dirname "$0")/../"

echo "Setting up Python backend..."

# Create python backend directory
mkdir -p backend

# Initialize uv project in backend directory
cd backend
uv init --bare

# Add required dependencies
uv add fastapi
uv add uvicorn
uv add groq
uv add python-dotenv
uv add pydantic
uv add aiofiles

echo "Backend setup complete. Run with: cd backend && uv run uvicorn main:app --reload --port 8000"
