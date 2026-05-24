# nextjs-frontend (ArtistKashi)

Minimal frontend scaffold for ArtistKashi. Folder layout:

- src/app: Next.js App Router routes and layouts
- src/components: Reusable UI components (ui, layout, cards, animations)
- src/features: Feature folders (auth, courses, shop, dashboard, admin, payments)
- src/hooks: React hooks and Zustand stores
- src/services: Client-side services (api, animation helpers)
- src/styles: Design tokens and global CSS

Design: cinematic black & gold tokens are set in globals.css. Keep components small and accessible.

Docker (minimal) — running locally with Docker Compose:

- Backend (FastAPI): exposed on 8000
- Frontend (Next.js): exposed on 3000

1. Build images and start services:

  docker-compose up --build

2. Environment:
- Set backend .env (DATABASE_URL, SECRET KEYS). Example files are in backend/.env.example

About package managers and tools:
- pnpm is used for frontend package management. Use npm if you prefer, but pnpm is recommended for monorepos.
- uv (UV) is used to manage Python dependencies and packaging for the backend. Use uv sync --dev to bootstrap the backend environment.

About overrides/lock-shared-data/openapi.json:
- overrides/main.html: optional deployment artifact — safe to remove if not used. (left for now)
- local-shared-data/openapi.json and nextjs-frontend/openapi.json: generated OpenAPI schemas. Keep one canonical copy (backend writes OPENAPI_OUTPUT_FILE). If generating from backend, you can remove the extra file and keep backend/openapi.json.

Cleanup performed:
- Disabled GitHub workflows and pipeline ymls (kept files but disabled triggers) because Vercel will handle deployments.
- Added a minimal clientService shim to satisfy imports until OpenAPI client integration is enabled.

If you want, next actions:
- Remove or archive the leftover files (overrides/, local-shared-data/) — confirm and they will be deleted.
- Replace the clientService shim with the generated OpenAPI client and remove the shim.

