#!/bin/bash
set -e
cd "$(dirname "$0")"
rm -f ../flowrecover-chrome-extension.zip
zip -r ../flowrecover-chrome-extension.zip . -x "*.DS_Store" -x "build-zip.sh"
echo "✅ Packaged ../flowrecover-chrome-extension.zip successfully!"

