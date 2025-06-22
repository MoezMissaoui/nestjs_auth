# Makefile for managing the local development Docker environment.
# It uses the development-specific compose file.
COMPOSE_FILE := -f docker-compose.dev.yml

# --- Primary Commands ---

# Build images and start all services in detached mode.
# Use this for the first time or after changing the Dockerfile.
up-build:
	docker-compose $(COMPOSE_FILE) up --build -d

# Start all services in detached mode without rebuilding.
up:
	docker-compose $(COMPOSE_FILE) up -d

# Stop and remove all containers, networks, and volumes.
down:
	docker-compose $(COMPOSE_FILE) down

# --- Utility Commands ---

# Build or rebuild the images for services.
build:
	docker-compose $(COMPOSE_FILE) build

# Follow the logs from all running services.
logs:
	docker-compose $(COMPOSE_FILE) logs -f

# Restart all services.
restart:
	docker-compose $(COMPOSE_FILE) restart

# List all running containers for this project.
ps:
	docker-compose $(COMPOSE_FILE) ps

# Stop all running services without removing them.
stop:
	docker-compose $(COMPOSE_FILE) stop

# Start services that have been stopped.
start:
	docker-compose $(COMPOSE_FILE) start

# Manually run the database seeder.
# Useful if you want to re-seed the DB without restarting everything.
seed:
	docker-compose $(COMPOSE_FILE) run --rm nstau_seeder_dev

# --- Housekeeping ---

# Declare targets as phony to prevent conflicts with files of the same name.
.PHONY: up-build up down build logs restart ps stop start seed

