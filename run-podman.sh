#!/bin/bash

# Build backend image
cd backend
podman build -t bio-backend .

# Run backend container
podman run -d -p 8000:8000 --name bio-backend-container bio-backend

echo "Backend running in podman container on http://localhost:8000"
echo "To stop: podman stop bio-backend-container && podman rm bio-backend-container"
