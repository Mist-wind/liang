@echo off
echo === GitHub Pages Auto Deploy ===
echo.

git config user.email "2550214996.lw@gmail.com"
git config user.name "2550214996lw-rgb"

echo [1/3] Adding files...
git add .

echo [2/3] Committing...
git commit -m "Auto update"

echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo === Done! ===
pause