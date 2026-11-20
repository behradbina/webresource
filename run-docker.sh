# Build all containers
docker compose build

# Run in background
docker compose up -d

# Check logs
docker compose logs -f

# Stop containers
docker compose down

# Stop and remove volumes (this will delete data!)
docker compose down -v

# Rebuild after changes
docker compose up -d --build

# Check container status
docker compose ps

# Access container shell
docker exec -it backend sh