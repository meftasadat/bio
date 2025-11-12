#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="${1:-dev}"

if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required. Install it via https://github.com/astral-sh/uv" >&2
  exit 1
fi

cleanup() {
  pkill -P $$ >/dev/null 2>&1 || true
}
trap cleanup EXIT

install_frontend_dependencies() {
  pushd "$ROOT_DIR/frontend" >/dev/null
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
  popd >/dev/null
}

build_frontend() {
  install_frontend_dependencies
  pushd "$ROOT_DIR/frontend" >/dev/null
  echo "Building frontend..."
  npm run build
  popd >/dev/null

  local build_dir="$ROOT_DIR/frontend/dist"
  local backend_static="$ROOT_DIR/backend/app/static/web"
  echo "Syncing frontend build to $backend_static"
  rm -rf "$backend_static"
  mkdir -p "$backend_static"
  rsync -a "$build_dir"/ "$backend_static"/
}

sync_backend() {
  pushd "$ROOT_DIR/backend" >/dev/null
  echo "Syncing backend dependencies..."
  uv sync --frozen
  popd >/dev/null
}

start_backend() {
  echo "Starting FastAPI backend on http://localhost:8000"
  uv run --project "$ROOT_DIR/backend" \
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
}

start_frontend_dev() {
  install_frontend_dependencies
  pushd "$ROOT_DIR/frontend" >/dev/null
  echo "Starting Vite dev server on http://localhost:5173"
  npm run dev -- --host 0.0.0.0 --port 5173 &
  FRONTEND_PID=$!
  popd >/dev/null
}

MODE_LOWER=$(echo "$MODE" | tr '[:upper:]' '[:lower:]')

case "$MODE_LOWER" in
  dev)
    sync_backend
    start_backend
    start_frontend_dev
    wait $BACKEND_PID $FRONTEND_PID
    ;;
  build|prod)
    build_frontend
    sync_backend
    start_backend
    wait $BACKEND_PID
    ;;
  *)
    echo "Unknown mode '$MODE'. Use 'dev' (default) or 'build'." >&2
    exit 1
    ;;
esac
