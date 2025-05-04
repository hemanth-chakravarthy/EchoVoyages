# EchoVoyages Docker Setup

This document provides instructions for setting up and running the EchoVoyages application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/echovoyages.git
   cd echovoyages
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

   This command will:
   - Build the Docker images for the backend and frontend
   - Start all services (MongoDB, Solr, backend, and frontend)
   - Set up the necessary networks and volumes

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Swagger API Docs: http://localhost:5000/api-docs
   - Solr Admin: http://localhost:8983/solr/

## Docker Services

The application consists of the following Docker services:

### MongoDB
- Container name: `echovoyages-mongodb`
- Port: 27017
- Credentials: admin/password
- Data is persisted in a Docker volume

### Solr
- Container name: `echovoyages-solr`
- Port: 8983
- Preconfigured with a core named `users_core`
- Data is persisted in a Docker volume

### Backend
- Container name: `echovoyages-backend`
- Port: 5000
- Built from the `./backend` directory
- Connected to MongoDB and Solr
- Source code is mounted as a volume for development

### Frontend
- Container name: `echovoyages-frontend`
- Port: 5173
- Built from the `./frontend` directory
- Served using Nginx
- Source code is mounted as a volume for development

## Development Workflow

When developing with Docker:

1. Make changes to the code in the `backend` or `frontend` directories
2. The changes will be automatically reflected in the running containers (thanks to volume mounting)
3. For backend changes, the server will restart automatically (using nodemon)
4. For frontend changes, the development server will automatically rebuild and refresh

## Troubleshooting

### Container not starting
Check the logs for the specific container:
```bash
docker-compose logs <service-name>
```

### Database connection issues
Ensure MongoDB is running and accessible:
```bash
docker-compose exec mongodb mongo -u admin -p password --authenticationDatabase admin
```

### Rebuilding containers
If you need to rebuild a container after making changes to the Dockerfile:
```bash
docker-compose build <service-name>
docker-compose up -d <service-name>
```

### Resetting everything
To completely reset the environment (including volumes):
```bash
docker-compose down -v
docker-compose up -d
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Builds and tests the application
2. Creates Docker images
3. Pushes the images to Docker Hub
4. Deploys to the production server

To use this pipeline, you need to set up the following GitHub secrets:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token
- `DEPLOY_HOST`: The hostname of your deployment server
- `DEPLOY_USERNAME`: The username for SSH access to the deployment server
- `DEPLOY_KEY`: The SSH private key for accessing the deployment server
