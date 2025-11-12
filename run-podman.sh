#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-bio}"
CONTAINER_NAME="${2:-bio-container}"

podman build -t "$IMAGE_NAME" -f Dockerfile .
podman rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
podman run -d -p 8000:8000 --name "$CONTAINER_NAME" "$IMAGE_NAME"

echo "Application running at http://localhost:8000"
echo "Stop with: podman stop $CONTAINER_NAME && podman rm $CONTAINER_NAME"
