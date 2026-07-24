#!/bin/bash

# Ensure background processes are terminated when script is killed or stopped
trap "kill 0" EXIT INT TERM

echo "Starting Observability Copilot Stack..."

# 1. Start FastAPI Backend in background
echo "1. Launching FastAPI Backend on http://localhost:8000..."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 2. Start AI Observer Agent in background
echo "2. Launching SigNoz AI Observer Agent..."
python3 agent/observer.py &

# 3. Start Next.js Frontend
echo "3. Launching Next.js Frontend on http://localhost:3000..."
cd frontend
rm -rf .next
npm run dev
