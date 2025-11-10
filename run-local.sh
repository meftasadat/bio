#!/bin/bash

# Activate uv venv
source .venv/bin/activate

# Install backend dependencies
cd backend
uv sync

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# Install frontend dependencies and run
cd ../frontend
npm install
npm run dev &

# Wait for all background processes
wait
