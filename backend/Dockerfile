FROM node:18 as frontend

WORKDIR /frontend

COPY ../frontend/package*.json ./

RUN npm install

COPY ../frontend/ .

RUN npm run build

FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml .

RUN uv sync --no-install-project --no-dev

COPY . .

COPY --from=frontend /frontend/dist ./app/static

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
