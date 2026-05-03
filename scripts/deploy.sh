#!/bin/bash

echo "🚀 Deploying BPJS Helpdesk to Production..."

# 1. Build Docker images
cd infra/docker
docker-compose -f docker-compose.prod.yml build

# 2. Stop old containers
docker-compose -f docker-compose.prod.yml down

# 3. Start new containers
docker-compose -f docker-compose.prod.yml up -d

# 4. Run migrations
echo "⏳ Running database migrations..."
sleep 5
docker exec bpjs-web-prod pnpm --filter @bpjs/database db:deploy

# 5. Check status
echo "✅ Deployment complete!"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📊 Services:"
echo "  - App: http://localhost:3000"
echo "  - MinIO Console: http://localhost:9001"
echo ""