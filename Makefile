# Node Utility Management System - Makefile
# Various backend development scenarios

.PHONY: help install dev build start clean test lint format

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# SETUP & INSTALLATION
# =============================================================================

install: ## Install dependencies
	npm install

install-clean: ## Clean install dependencies
	rm -rf node_modules package-lock.json
	npm install

update: ## Update dependencies
	npm update

# =============================================================================
# DEVELOPMENT
# =============================================================================

dev: ## Start development server with hot reload
	npm run dev

dev-no-watch: ## Start development server without watch mode
	npm run dev:no-watch

build: ## Build TypeScript to JavaScript
	npm run build

start: ## Start production server
	npm start

# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

db-setup: ## Complete database setup (generate + push + seed)
	make db-migrate
	make db-seed

db-generate: ## Generate Prisma client
	npm run db:generate

db-push: ## Push schema changes to database
	npm run db:push

db-migrate: ## Create and apply new migration
	npm run db:migrate

db-studio: ## Open Prisma Studio
	npm run db:studio

db-seed: ## Seed database with initial data
	npm run seed

db-reset: ## Reset database (drop + migrate + seed)
	npx prisma migrate reset --force
	make db-seed

db-deploy: ## Deploy migrations to production
	npx prisma migrate deploy

# =============================================================================
# DOCKER OPERATIONS
# =============================================================================

docker-up: ## Start PostgreSQL with Docker
	docker compose up -d

docker-down: ## Stop Docker containers
	docker compose down

docker-logs: ## View Docker container logs
	docker compose logs -f

docker-clean: ## Remove Docker containers and volumes
	docker compose down -v --remove-orphans

docker-rebuild: ## Rebuild and restart containers
	docker compose down
	docker compose up -d --build

# =============================================================================
# TESTING & QUALITY
# =============================================================================

test: ## Run tests (when implemented)
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run ESLint
	npx eslint src/ --ext .ts

lint-fix: ## Fix ESLint issues
	npx eslint src/ --ext .ts --fix

format: ## Format code with Prettier
	npx prettier --write "src/**/*.{ts,js,json}"

format-check: ## Check code formatting
	npx prettier --check "src/**/*.{ts,js,json}"

type-check: ## Run TypeScript type checking
	npx tsc --noEmit

# =============================================================================
# PROJECT MANAGEMENT
# =============================================================================

clean: ## Clean build artifacts
	rm -rf dist/
	rm -rf generated/

clean-all: ## Clean everything (build + node_modules)
	make clean
	rm -rf node_modules/

logs: ## View application logs (if using PM2 or similar)
	tail -f logs/*.log 2>/dev/null || echo "No log files found"

# =============================================================================
# ENVIRONMENT MANAGEMENT
# =============================================================================

env-setup: ## Setup environment file
	cp .env.example .env
	@echo "Please edit .env file with your configuration"

env-validate: ## Validate environment variables
	@node -e "require('dotenv').config(); console.log('Environment variables loaded successfully')"

# =============================================================================
# SECURITY & AUDIT
# =============================================================================

audit: ## Run npm security audit
	npm audit

audit-fix: ## Fix npm security issues
	npm audit fix

outdated: ## Check for outdated packages
	npm outdated

# =============================================================================
# DEPLOYMENT HELPERS
# =============================================================================

pre-deploy: ## Pre-deployment checks
	make lint
	make type-check
	make build
	make db-deploy
	@echo "Pre-deployment checks completed"

deploy-staging: ## Deploy to staging
	@echo "Deploying to staging..."
	make pre-deploy
	# Add your staging deployment commands here

deploy-prod: ## Deploy to production
	@echo "Deploying to production..."
	make pre-deploy
	# Add your production deployment commands here

# =============================================================================
# MONITORING & DEBUGGING
# =============================================================================

health-check: ## Check application health
	curl -f http://localhost:3000/ || echo "Application not responding"

debug: ## Start application in debug mode
	NODE_ENV=development DEBUG=* npm run dev

inspect: ## Start with Node.js inspector
	node --inspect dist/index.js

# =============================================================================
# BACKUP & RESTORE
# =============================================================================

backup-db: ## Backup database
	@echo "Creating database backup..."
	pg_dump $(DATABASE_URL) > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restore database from backup (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Usage: make restore-db FILE=backup.sql"; exit 1; fi
	psql $(DATABASE_URL) < $(FILE)

# =============================================================================
# QUICK WORKFLOWS
# =============================================================================

fresh-start: ## Fresh development start (clean + install + setup)
	make clean-all
	make install
	make env-setup
	make docker-up
	sleep 5
	make db-setup
	make dev

quick-setup: ## Quick project setup for new developers
	make install
	make env-setup
	make docker-up
	sleep 5
	make db-setup
	@echo "Setup complete! Run 'make dev' to start development"

reset-dev: ## Reset development environment
	make docker-down
	make clean
	make docker-up
	sleep 5
	make db-reset
	make dev

# =============================================================================
# UTILITIES
# =============================================================================

port-check: ## Check if port 3000 is available
	@lsof -ti:3000 && echo "Port 3000 is in use" || echo "Port 3000 is available"

kill-port: ## Kill process on port 3000
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"

show-env: ## Show current environment variables (excluding secrets)
	@env | grep -E '^(NODE_ENV|PORT|DATABASE_URL)' | sed 's/=.*/=***/'

# =============================================================================
# DOCUMENTATION
# =============================================================================

docs: ## Generate API documentation
	@echo "API documentation available at http://localhost:3000/docs"

swagger: ## Open Swagger documentation
	open http://localhost:3000/docs || xdg-open http://localhost:3000/docs