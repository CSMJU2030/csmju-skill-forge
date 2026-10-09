# csmju-skillforge — frontend

Next.js (App Router) + Tailwind UI for SkillForge. Talks only to this
subsystem's own backend through same-origin rewrites, never to Core Hub or any
database directly.

Authentication starts through Core Hub SSO. Backend-issued HttpOnly cookies
hold the verified access token; frontend code never reads or stores it.
Unauthenticated page navigation and API `401` responses start a top-level
reauthentication flow.

## Run locally

```bash
cp .env.example .env.local
pnpm install
pnpm run dev     # http://localhost:3000
```

The backend must be running on `http://127.0.0.1:3002`; use
`SUBSYSTEM_ID=csmju-skill-forge` for the backend and register the matching
callback URL and role mapping in Core Hub. The frontend reads its subsystem ID
from the root `subsystem.yaml`; optional environment overrides must match it.

## Container image

Build from the repository root:

```bash
docker build -f frontend/Dockerfile -t csmju-skill-forge-web .
```

The image runs Next.js in standalone mode on port `3000`. `BACKEND_URL` is a
build-time setting for the `/api/*` and `/auth/*` rewrites; its default,
`http://api:4000`, expects the backend service to be named `api` on the same
container network.

## Pages

| Route | What it shows |
|---|---|
| `/dashboard` | readiness gauge, career-path picker/switcher, strengths & gaps summary |
| `/roadmap` | prioritized milestones (courses → certs → projects) for the weakest skills |
| `/skills` | grade entry + full skill-gap breakdown |
| `/certificates` | free certificate catalog + per-student recommendations |
| `/projects` | portfolio project ideas + per-student recommendations |
| `/documents` | resume / cover letter / portfolio generator + history |
| `/admin/courses` | course catalog CRUD — staff/admin accounts only (`StaffOnlyGuard` on the backend) |
