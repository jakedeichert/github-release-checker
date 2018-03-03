#!/bin/bash
set -e
echo "==========================================================="
echo "DEPLOYING TO GITHUB PAGES"
echo "==========================================================="

THIS_SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $THIS_SCRIPTS_DIR/..

echo ">>> Building for production..."
yarn run build:ghpages

echo ">>> Deploying to github pages..."
git checkout gh-pages
rm -rf bundle/
mv dist/* .
rm -rf dist
git add -A
git commit -m "Redeploy"
git push
git checkout master
