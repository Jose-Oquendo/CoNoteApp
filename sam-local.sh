#!/bin/bash
echo "======================================================="
echo "  CoNote - AWS SAM Local Emulation Launcher"
echo "======================================================="
echo ""
echo "1. Building AWS SAM package..."
sam build

if [ $? -ne 0 ]; then
    echo "[ERROR] AWS SAM build failed."
    exit 1
fi

echo ""
echo "2. Starting AWS SAM Local API on http://localhost:3001 ..."
echo "   (Press Ctrl+C to stop)"
sam local start-api --port 3001
