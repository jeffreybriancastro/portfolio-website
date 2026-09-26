#!/bin/sh
# Copy the public site into dist/ for hosts that publish a folder as-is
# (Cloudflare Pages). Only what a visitor should be able to fetch goes in:
# the same exclusions .vercelignore makes for Vercel - notes, the GoHighLevel
# working files and Impeccable's state stay out.
#
#   sh scripts/build-site.sh        -> dist/
#
# Cloudflare Pages settings: build command "sh scripts/build-site.sh",
# output directory "dist".
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist
cp -R index.html 404.html work css js img og.png robots.txt sitemap.xml LICENSE _headers dist/
echo "dist/: $(find dist -type f | wc -l | tr -d ' ') files"
