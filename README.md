# ArtistKashi

ArtistKashi is a cinematic luxury platform foundation for premium art education and curated painting commerce. This repository contains a production-ready starter for a modern full-stack application using Next.js (App Router) on the frontend and FastAPI on the backend.

This repository has been refactored into a clean, minimal, and extensible foundation for building:

- A premium online course (LMS) experience for artists
- A curated ecommerce gallery for original paintings and limited drops
- Secure user authentication and admin tooling
- Scalable API-first architecture with OpenAPI-driven typed clients

What was changed since the original template:

- All demo and placeholder content removed or replaced with clean scaffolding
- Branding updated to ArtistKashi and default SEO metadata adjusted
- Design tokens and Tailwind config prepared for a cinematic black & gold aesthetic
- Frontend and backend kept modular and ready for feature development

Quick start (frontend):

  cd nextjs-frontend
  pnpm install
  pnpm dev

Quick start (backend):

  cd backend
  python -m pip install -r requirements.txt
  uv run pytest  # runs tests

Repository structure highlights

- nextjs-frontend/: Next.js App Router frontend (TypeScript, Tailwind)
- backend/: FastAPI backend with async SQLAlchemy and auth
- openapi.json: single source of truth for typed client generation

Contributing

This repo is a refactored starting point for ArtistKashi. Features should be added under src/features (frontend) and app/api/v1 or app/services (backend). Keep UI components under src/components for reuse and prefer composing small, accessible building blocks.

License

This project retains the original LICENSE as provided in the repository root.

Contact

For questions about the refactor or architecture decisions, open an issue or contact the project maintainer.

Docker (recommended local development)

- Uses docker-compose to run frontend (3000), backend (8000), and Postgres.

1. Build and start services:

   docker-compose up --build

2. Environment: copy backend/.env.example to backend/.env and update SECRET KEYS and DATABASE_URL if needed.

Admin bootstrap (backend):

- Run `python -m commands.create_admin` from the `backend/` folder.
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment, or pass `--email` and `--password`.
- The command is idempotent: it creates the user if missing, or promotes an existing user to superuser.
- The commented `admin-bootstrap` service in `docker-compose.yml` shows the same command for local one-off runs.

Render production:

- Keep the app service running normally from the Dockerfile.
- Open a Render shell or create a one-off job using the same image, then run `python -m commands.create_admin` with the admin env vars set.
- If you only need to promote an existing account, you can omit `ADMIN_PASSWORD`; the command will leave the stored password unchanged unless `ADMIN_UPDATE_PASSWORD=true`.

Notes on cleanup performed

- Disabled GitHub workflows and archived pipeline files to keep repository minimal. They can be restored or re-enabled later.
- Created a small clientService shim (nextjs-frontend/src/app/clientService.ts) as a temporary adapter until OpenAPI client is generated from the backend.
- Design tokens and Tailwind updated for cinematic black & gold look.

Files suggested for manual removal (optional):
- local-shared-data/openapi.json (generated OpenAPI schema) — keep one canonical copy if you regenerate client
- nextjs-frontend/openapi.json (generated client schema)
- overrides/ (deployment overrides archive)

If you want, grant permission and I will continue by:
- Removing or archiving more unused files and components
- Replacing clientService shim with generated OpenAPI client
- Implementing basic CI via Vercel configuration

