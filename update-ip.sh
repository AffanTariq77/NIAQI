#!/bin/bash

# Script to automatically update IP addresses in .env files

# Get current IP address (excluding localhost)
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not detect IP address"
    exit 1
fi

echo "🔍 Current IP detected: $CURRENT_IP"
echo ""

# Update Backend .env
BACKEND_ENV="NIAQI_Backend/.env"
if [ -f "$BACKEND_ENV" ]; then
    # Check current IP in backend
    CURRENT_BACKEND_IP=$(grep "API_HOST=" "$BACKEND_ENV" | cut -d'=' -f2)
    
    if [ "$CURRENT_BACKEND_IP" != "$CURRENT_IP" ]; then
        echo "📝 Updating Backend .env..."
        sed -i '' "s/API_HOST=.*/API_HOST=$CURRENT_IP/" "$BACKEND_ENV"
        echo "✅ Backend updated: $CURRENT_BACKEND_IP → $CURRENT_IP"
    else
        echo "✓ Backend .env already has correct IP: $CURRENT_IP"
    fi
else
    echo "❌ Backend .env not found at $BACKEND_ENV"
fi

echo ""

# Update Frontend .env
FRONTEND_ENV="NIAQI/.env"
if [ -f "$FRONTEND_ENV" ]; then
    # Check current IP in frontend
    CURRENT_FRONTEND_IP=$(grep "EXPO_PUBLIC_API_HOST=" "$FRONTEND_ENV" | cut -d'=' -f2)
    
    if [ "$CURRENT_FRONTEND_IP" != "$CURRENT_IP" ]; then
        echo "📝 Updating Frontend .env..."
        sed -i '' "s/EXPO_PUBLIC_API_HOST=.*/EXPO_PUBLIC_API_HOST=$CURRENT_IP/" "$FRONTEND_ENV"
        echo "✅ Frontend updated: $CURRENT_FRONTEND_IP → $CURRENT_IP"
    else
        echo "✓ Frontend .env already has correct IP: $CURRENT_IP"
    fi
else
    echo "❌ Frontend .env not found at $FRONTEND_ENV"
fi

echo ""
echo "🎯 Configuration Summary:"
echo "   IP Address: $CURRENT_IP"
echo "   Backend: http://$CURRENT_IP:5000/api"
echo "   Frontend: http://$CURRENT_IP:8081"
echo ""
echo "💡 Next steps:"
echo "   1. Restart backend: cd NIAQI_Backend && npm run start:dev"
echo "   2. Restart frontend: cd NIAQI && npx expo start --clear"
