#!/bin/sh
set -eu

mkdir -p dist/css dist/js dist/assets/images dist/assets/icons
cp ./*.html dist/
cp css/*.css dist/css/
cp js/*.js dist/js/
cp assets/images/* dist/assets/images/

printf 'CyberBus static build ready in dist/\n'
