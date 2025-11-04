#!/bin/bash

# Script to upload n8n-nodes-confluence-v2 to GitHub

echo "🚀 Uploading n8n Confluence V2 Node to GitHub"
echo "=============================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Show status
echo ""
echo "📊 Git status:"
git status --short

# Commit
echo ""
read -p "Enter commit message (default: 'Initial commit: n8n Confluence V2 node'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Initial commit: n8n Confluence V2 node"}

git commit -m "$COMMIT_MSG"
echo "✅ Changes committed"

# Ask for GitHub username
echo ""
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Repository name
REPO_NAME="n8n-nodes-confluence-v2"

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
echo ""
echo "🔗 Adding remote: $REPO_URL"
git remote add origin "$REPO_URL"

# Set main branch
git branch -M main

echo ""
echo "=============================================="
echo "⚠️  IMPORTANT: Before pushing, you need to:"
echo "=============================================="
echo ""
echo "1. Go to GitHub: https://github.com/new"
echo "2. Create a new repository named: $REPO_NAME"
echo "3. Make it PUBLIC (so Docker can clone it)"
echo "4. Do NOT initialize with README, .gitignore, or license"
echo ""
echo "=============================================="
echo ""
read -p "Have you created the repository on GitHub? (y/n): " CREATED

if [ "$CREATED" != "y" ] && [ "$CREATED" != "Y" ]; then
    echo ""
    echo "⏸️  Paused. Create the repository first, then run:"
    echo "   git push -u origin main"
    exit 0
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=============================================="
    echo "✅ SUCCESS! Code uploaded to GitHub"
    echo "=============================================="
    echo ""
    echo "📍 Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "🐳 Next steps for Docker setup:"
    echo "1. Update Dockerfile - replace YOUR_USERNAME with: $GITHUB_USER"
    echo "2. Update docker-compose.yml - replace YOUR_USERNAME with: $GITHUB_USER"
    echo "3. Run: docker-compose build"
    echo "4. Run: docker-compose up -d"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "1. Repository doesn't exist on GitHub"
    echo "2. Authentication failed (use personal access token)"
    echo "3. Repository is not empty"
    echo ""
    echo "To fix authentication, use:"
    echo "git push -u origin main"
    echo ""
fi
