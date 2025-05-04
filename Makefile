.PHONY: build up down logs ps clean test

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# List running containers
ps:
	docker-compose ps

# Clean up volumes, images, and containers
clean:
	docker-compose down -v
	docker system prune -f

# Run tests
test:
	docker-compose run --rm backend npm test
	docker-compose run --rm frontend npm run test

# Initialize Solr cores
init-solr:
	docker-compose exec solr solr create_core -c packages
	docker-compose exec solr solr create_core -c guides

# Backup MongoDB data
backup-db:
	docker-compose exec mongodb mongodump --out=/data/db/backup --username=admin --password=password --authenticationDatabase=admin

# Restore MongoDB data
restore-db:
	docker-compose exec mongodb mongorestore /data/db/backup --username=admin --password=password --authenticationDatabase=admin

# Generate Swagger documentation
swagger:
	docker-compose exec backend npm run swagger-autogen

# Enter backend shell
backend-shell:
	docker-compose exec backend sh

# Enter frontend shell
frontend-shell:
	docker-compose exec frontend sh

# Enter MongoDB shell
mongo-shell:
	docker-compose exec mongodb mongo -u admin -p password --authenticationDatabase admin
