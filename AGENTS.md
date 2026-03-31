# EchoVoyages V2

## Project Overview

EchoVoyages V2 is a full-stack web application with a React/Vite frontend and a backend (likely Node.js/Express). The project uses MongoDB (via Mongoose) for data persistence and includes Docker support for containerized deployment.

## Tech Stack

- **Frontend:** React, Vite, Three.js, Vanta.js, FontAwesome, React Icons
- **Backend:** Node.js, Express, Mongoose (MongoDB ODM)
- **DevOps:** Docker, Docker Compose, Render deployment
- **Auth:** bcrypt
- **API Docs:** Swagger (swagger-jsdoc, swagger-ui-express)

## Project Structure

- `frontend/` - React/Vite frontend application
- `backend/` - Node.js/Express backend API
- `docker-compose.yml` - Multi-container Docker setup
- `Dockerfile` - Container configuration
- `render.yaml` - Render deployment configuration

## Key Commands

- `make` - See Makefile for available commands
- `./deploy.sh` - Deployment script

## Notes

- Environment variables are configured via `.env` (see `.env_example` for template)
- MongoDB connection can be tested with `test-mongo-connection.js`
