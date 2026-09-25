#!/usr/bin/env bash
# Concatenates the source fragments in src/ into the single-file prototype (index.html).
set -e
cd "$(dirname "$0")"
cat src/1_head.html src/2_body.html src/3_data.js src/4_app.js src/5_pages.js src/6_sys.js > index.html
echo "Built index.html"
