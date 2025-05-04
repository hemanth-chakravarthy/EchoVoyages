#!/bin/bash

# EchoVoyages Deployment Script

# Exit on error
set -e

# Display help message
function show_help {
  echo "EchoVoyages Deployment Script"
  echo ""
  echo "Usage: ./deploy.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  -h, --help       Display this help message"
  echo "  -b, --build      Build all Docker images"
  echo "  -u, --up         Start all services"
  echo "  -d, --down       Stop all services"
  echo "  -r, --restart    Restart all services"
  echo "  -c, --clean      Clean up Docker resources"
  echo "  -l, --logs       View logs"
  echo "  -p, --pull       Pull latest code and restart"
  echo ""
}

# Build Docker images
function build_images {
  echo "Building Docker images..."
  docker-compose build
  echo "Build completed."
}

# Start services
function start_services {
  echo "Starting services..."
  docker-compose up -d
  echo "Services started. Use './deploy.sh -l' to view logs."
}

# Stop services
function stop_services {
  echo "Stopping services..."
  docker-compose down
  echo "Services stopped."
}

# Restart services
function restart_services {
  echo "Restarting services..."
  docker-compose down
  docker-compose up -d
  echo "Services restarted."
}

# Clean up Docker resources
function clean_resources {
  echo "Cleaning up Docker resources..."
  docker-compose down -v
  docker system prune -f
  echo "Cleanup completed."
}

# View logs
function view_logs {
  echo "Viewing logs (press Ctrl+C to exit)..."
  docker-compose logs -f
}

# Pull latest code and restart
function pull_and_restart {
  echo "Pulling latest code..."
  git pull
  
  echo "Restarting services..."
  docker-compose down
  docker-compose build
  docker-compose up -d
  
  echo "Deployment completed."
}

# Process command line arguments
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

case "$1" in
  -h|--help)
    show_help
    ;;
  -b|--build)
    build_images
    ;;
  -u|--up)
    start_services
    ;;
  -d|--down)
    stop_services
    ;;
  -r|--restart)
    restart_services
    ;;
  -c|--clean)
    clean_resources
    ;;
  -l|--logs)
    view_logs
    ;;
  -p|--pull)
    pull_and_restart
    ;;
  *)
    echo "Unknown option: $1"
    show_help
    exit 1
    ;;
esac

exit 0
