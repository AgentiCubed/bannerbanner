#!/bin/bash

set -e

echo "🍌 Building BannerBanner Extension..."

echo "📦 Step 1: Building React app..."
npm run build

echo "📁 Step 2: Copying extension files..."
cp extension/manifest.json dist/
cp extension/background.js dist/
cp extension/content.js dist/
cp extension/popup.html dist/

echo "🎨 Step 3: Creating placeholder icons..."
mkdir -p dist/icons

echo "ℹ️  Note: Add your own icon images to dist/icons/"
echo "   Required sizes: icon-16.png, icon-32.png, icon-48.png, icon-128.png"

echo "✅ Build complete! Extension ready in dist/"
echo ""
echo "📋 Next steps:"
echo "1. Add icon images to dist/icons/"
echo "2. Open chrome://extensions/"
echo "3. Enable Developer mode"
echo "4. Click 'Load unpacked' and select the dist/ folder"
echo ""
echo "🍌 Happy banana-ing!"
