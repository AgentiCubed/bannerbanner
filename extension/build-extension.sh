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

echo "🎨 Step 3: Copying icons..."
mkdir -p dist/icons

if [ -f "extension/icons/icon-16.png" ]; then
    echo "  ✅ Copying icons..."
    cp extension/icons/icon-*.png dist/icons/ 2>/dev/null || true
else
    echo ""
    echo "⚠️  WARNING: Extension icons not found!"
    echo ""
    echo "📝 To generate icons:"
    echo "   1. Open extension/icons/generate-icons.html in your browser"
    echo "   2. Click 'Download All Icons as ZIP'"
    echo "   3. Extract to extension/icons/"
    echo "   4. Run this build script again"
    echo ""
fi

echo "📦 Step 4: Copying store assets..."
mkdir -p dist/assets

echo "✅ Build complete! Extension ready in dist/"
echo ""
echo "📋 Next steps:"

if [ ! -f "extension/icons/icon-16.png" ]; then
    echo ""
    echo "🎨 STEP 1: Generate Icons (REQUIRED)"
    echo "   → Open: extension/icons/generate-icons.html"
    echo "   → Download all icons and place in extension/icons/"
    echo "   → Run build script again"
    echo ""
fi

echo "🧪 STEP 2: Test the Extension Locally"
echo "   1. Open chrome://extensions/"
echo "   2. Enable 'Developer mode' (top right)"
echo "   3. Click 'Load unpacked'"
echo "   4. Select the dist/ folder"
echo "   5. Test on websites with cookie banners"
echo ""
echo "🏪 STEP 3: Prepare for Chrome Web Store"
echo "   1. Generate store assets:"
echo "      → Open: extension/assets/generate-store-assets.html"
echo "      → Download promotional tiles and screenshot templates"
echo "   2. Create actual screenshots of your extension"
echo "   3. Follow guide: extension/CHROME_WEB_STORE_SUBMISSION.md"
echo ""
echo "📦 STEP 4: Package for Distribution"
echo "   cd dist && zip -r ../bannerbanner-v1.0.0.zip ."
echo ""
echo "🍌 Happy banana-ing!"
