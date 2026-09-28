#!/bin/sh
# Copy the public site into dist/ for hosts that publish a folder as-is
# (Cloudflare Pages). Only what a visitor should be able to fetch goes in:
# the same exclusions .vercelignore makes for Vercel - notes, the GoHighLevel
# working files and Impeccable's state stay out.
#
#   sh scripts/build-site.sh        -> dist/
#
# Cloudflare (Pages or Workers Builds): build command "sh scripts/build-site.sh",
# output directory "dist".
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist
cp -R ./*.html work templates css js img icons og.png robots.txt sitemap.xml LICENSE _headers dist/
rm -f dist/css/template.orig.css
echo "dist/: $(find dist -type f | wc -l | tr -d ' ') files"
