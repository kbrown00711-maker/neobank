#!/bin/bash

echo "🏦 NeoBank Setup Script"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up Convex..."
echo "Run the following commands in separate terminals:"
echo ""
echo "Terminal 1: npx convex dev"
echo "Terminal 2: npm run dev"
echo ""
echo "Then run: npx convex run seed:seedDatabase"
echo ""
echo "📝 Don't forget to:"
echo "1. Copy .env.local.example to .env.local"
echo "2. Add your Convex URL to .env.local"
echo ""
echo "🎉 Setup complete! Follow the instructions above to start."
