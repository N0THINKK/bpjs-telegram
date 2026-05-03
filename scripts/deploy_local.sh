#!/bin/bash

echo "🚀 Deploying BPJS Helpdesk Locally..."

# 1. Build Docker images
cd infra/docker
docker-compose up -d --build

# 2. Run migrations (Optional but recommended if schema changed)
# Since we might not be running the web app inside docker locally, 
# you usually run this natively via your terminal instead of docker exec
echo "⏳ To run database migrations, run this in your terminal:"
echo "pnpm --filter @bpjs/database db:push"

# 3. Check status
echo "✅ Local Infrastructure Deployment complete!"
docker-compose ps

echo ""
echo "📊 Services:"
echo "  - Database: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - MinIO Console: http://localhost:9001"
echo ""
echo "Now run 'pnpm dev' in the root directory to start the web app!"
