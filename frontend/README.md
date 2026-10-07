# csmju-skillforge — frontend

Next.js (App Router) + Tailwind UI for SkillForge. Talks only to this
subsystem's own backend (`NEXT_PUBLIC_API_BASE_URL`), never to the Core Hub or
any database directly.

This app has no login page, no session, and no auth logic of its own — see
`src/lib/api.ts` for how it relays whatever bearer token Core Hub's SSO
session provides (not yet wired up; see the top-level README's "still to add"
list) and how local dev works without one.

## Run locally

```bash
cp .env.example .env
pnpm install
pnpm run dev     # http://localhost:3000
```

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
