FROM node:18 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build


FROM python:3.13-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies that may be needed
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app/backend
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv pip install --system -r pyproject.toml

COPY backend .
COPY --from=frontend-builder /app/frontend/dist ./app/static/web

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
