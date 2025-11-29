#!/bin/bash

echo "🔄 Restarting ListarPro backend..."

cd /Users/bdadd/Dev/ListarProOrig/listar-backend

# Start containers
echo "📦 Starting Docker containers..."
docker compose up -d

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Rename slider images
echo "🖼️  Renaming slider images..."
docker exec listar-backend mv /app/uploads/sliders/slider-1-optimized.jpg /app/uploads/sliders/slider-1.jpg 2>/dev/null || echo "  slider-1.jpg already exists"
docker exec listar-backend mv /app/uploads/sliders/slider-2-optimized.jpg /app/uploads/sliders/slider-2.jpg 2>/dev/null || echo "  slider-2.jpg already exists"
docker exec listar-backend mv /app/uploads/sliders/slider-3-optimized.jpg /app/uploads/sliders/slider-3.jpg 2>/dev/null || echo "  slider-3.jpg already exists"

# Verify backend is running
echo ""
echo "✅ Testing backend..."
curl -s http://192.168.42.129:3000/wp-json/listar/v1/home/init | head -c 100
echo ""
echo ""

# Test images
echo "🖼️  Testing image URLs..."
echo "Slider 1:"
curl -sI http://192.168.42.129:3000/uploads/sliders/slider-1.jpg | head -1
echo "Listing 21:"
curl -sI http://192.168.42.129:3000/uploads/listings/listing-21-thumb-full.jpg | head -1
echo "Category:"
curl -sI http://192.168.42.129:3000/uploads/categories/restaurants-medium.jpg | head -1

echo ""
echo "✅ Done! Backend should be running at http://192.168.42.129:3000"
