# Clean caches and reinstall frontend dependencies, then rebuild Docker
# Run this from repo root in PowerShell: .\scripts\clean-rebuild.ps1

Set-StrictMode -Version Latest

$frontend = "nextjs-frontend"

Write-Host "Removing frontend caches: node_modules, .next, pnpm-lock.yaml"
Remove-Item -LiteralPath "$frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "$frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "$frontend\pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

Write-Host "Installing dependencies with pnpm (ensure pnpm is installed)"
Push-Location $frontend
pnpm install
Pop-Location

Write-Host "Docker: rebuilding images (will use docker-compose in repo root)"
Write-Host "Commands prepared: docker compose down -v && docker system prune -a -f && docker compose build --no-cache && docker compose up -d"
# Uncomment next line to enable docker rebuild when you're ready
# docker compose down -v; docker system prune -a -f; docker compose build --no-cache; docker compose up -d

Write-Host "Done. If any step failed, run this script manually to inspect errors."
