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
`SUBSYSTEM_ID=csmju-skill-forge` in both environments and register the matching
callback URL and role mapping in Core Hub.

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
