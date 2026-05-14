#!/bin/bash

# Installation Script for Modular SaaS Platform
# This script will install PostgreSQL and set up the backend

set -e  # Exit on error

echo "🚀 Modular SaaS Platform - Installation Script"
echo "=============================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo ""
    echo "Please install Homebrew first by running:"
    echo ""
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    echo "After installation, Homebrew will show you commands to add it to your PATH."
    echo "Run those commands, then run this script again."
    exit 1
fi

echo "✅ Homebrew is installed"
echo ""

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
if brew list postgresql@15 &> /dev/null; then
    echo "✅ PostgreSQL 15 is already installed"
else
    brew install postgresql@15
    echo "✅ PostgreSQL 15 installed"
fi
echo ""

# Start PostgreSQL service
echo "🔄 Starting PostgreSQL service..."
brew services start postgresql@15
echo "✅ PostgreSQL service started"
echo ""

# Add PostgreSQL to PATH
echo "🔧 Adding PostgreSQL to PATH..."
if ! grep -q "postgresql@15/bin" ~/.zshrc; then
    echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
    echo "✅ Added to ~/.zshrc"
else
    echo "✅ Already in PATH"
fi

# Source the updated PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
echo ""

# Wait for PostgreSQL to start
echo "⏳ Waiting for PostgreSQL to start..."
sleep 3
echo ""

# Create database
echo "🗄️  Creating database..."
if psql -lqt | cut -d \| -f 1 | grep -qw modular_saas; then
    echo "✅ Database 'modular_saas' already exists"
else
    createdb modular_saas
    echo "✅ Database 'modular_saas' created"
fi
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi
echo ""

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# .env file already created
echo "✅ .env file is ready"
echo ""

# Run database migrations
echo "🔄 Running database migrations..."
alembic upgrade head
echo "✅ Database migrations completed"
echo ""

echo "=============================================="
echo "✅ Installation Complete!"
echo "=============================================="
echo ""
echo "🎉 Your backend is ready to run!"
echo ""
echo "To start the backend server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""
echo "Backend will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""
echo "Next steps:"
echo "1. Start the backend (commands above)"
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm install"
echo "   npm run dev"
echo "3. Open http://localhost:3000 and test!"
echo ""
