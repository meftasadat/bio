# Project Specification: Professional Portfolio Website

## Overview
This is a professional portfolio website for Mefta Sadat, built as a full-stack web application with a React frontend and FastAPI backend.

## Architecture
- **Frontend**: React application built with Vite, featuring portfolio sections (Hero, About, Experience, Talks, Publications, Blog)
- **Backend**: FastAPI application providing REST API endpoints for content and blog data
- **Deployment**: Containerized with Podman for backend, local development with uv for Python dependencies

## Technologies
- **Backend**:
  - Python 3.13
  - FastAPI framework
  - Uvicorn ASGI server
  - Package management: uv
- **Frontend**:
  - React 18
  - Vite build tool
  - React Router for navigation
  - Axios for API calls
- **Containerization**:
  - Podman for container management
  - Multi-stage Dockerfile (builds frontend, serves backend)

## API Endpoints
- `GET /` - Root endpoint
- `GET /api/content` - Portfolio content data
- `GET /api/blog` - Blog posts
- `GET /api/content/talks` - Public speaking engagements
- `GET /api/content/publications` - Scientific publications
- `GET /api/resume/download` - Resume PDF download
- `GET /health` - Health check

## Key Features
- Responsive portfolio website
- Blog functionality
- Dedicated sections for talks (with optional YouTube embeds) and research publications
- Resume download
- CORS enabled for frontend-backend communication
- Static file serving for assets

## Development Setup
- `run-local.sh` - Runs both frontend and backend locally using uv
- `run-podman.sh` - Runs backend in Podman container
- Frontend dev server on port 5173
- Backend API on port 8000

## Dependencies
- Backend: fastapi, uvicorn[standard], python-multipart (managed with uv)
- Frontend: react, react-dom, react-router-dom, axios

## File Structure
```
bio/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── content/
│   │   ├── models/
│   │   └── static/
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── run-local.sh
├── run-podman.sh
└── project-spec.md
```

## Requirements
- Python 3.13+
- Node.js 18+
- uv package manager
- Podman for containerization
- npm for frontend dependencies
