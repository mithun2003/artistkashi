#!/bin/bash

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Running in production"

    alembic upgrade head

    uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000

else
    echo "Running in development"

    uv sync

    fastapi dev app/main.py \
        --host 0.0.0.0 \
        --port 8000 \
        --reload &
    
    python watcher.py
fi

wait