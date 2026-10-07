# csmju-skillforge — backend

AI Career Skill Analyzer & Portfolio Builder. A **plug-in subsystem** of the
CSMJU2030 Unified Ecosystem — it has **no login page, no password, and no
session of its own**. Every request is expected to carry a bearer JWT that
Core Hub's SSO already issued the user:

```
Authorization: Bearer <token>
```

This subsystem verifies that token itself against Core Hub's published JWKS
(`CORE_HUB_JWKS_URL`, checked with issuer `CORE_HUB_ISSUER` / audience
`CORE_HUB_AUDIENCE`) — see `src/auth/`. It never issues, stores, or invents a
token; it only checks the signature/claims on the one the user already has.
The claims it reads out of the verified token are `username`, `layer1_role`,
and `faculty` (per Core's Standard JWT Payload Structure).

## What it does

1. Reads a student's completed courses + grades (entered here, or later synced
   from the Core's student-records subsystem via the standard API envelope).
2. Compares the student's per-skill proficiency (derived from grades in
   skill-mapped courses) against the skill profile of their chosen career path
   (e.g. DevSecOps Engineer) — see `src/gap-analysis/gap-analysis.service.ts`.
3. Surfaces strengths/gaps, a prioritized roadmap (courses → free certificates →
   portfolio projects), and lets the student generate an AI-drafted resume,
   cover letter, or portfolio page from that context.

## Run locally

```bash
docker compose up -d           # local Postgres for this subsystem only (port 5434)
cp .env.example .env           # configure a server encryption key for saved user AI credentials
pnpm install
npx prisma migrate dev --name init
pnpm run prisma:seed
pnpm run start:dev             # http://localhost:3002/api/v1
```

With `DEV_IDENTITY_FALLBACK=true` in `.env` (the default), any request with no
`Authorization` header is treated as a fake identity (`DEV_USERNAME`/`DEV_ROLE`/
`DEV_FACULTY`, all overridable) so you can develop without a real Core Hub
session in front of it. **Set it to `false` before this subsystem sits behind
the real Core Hub.**

## Endpoints (all under `/api/v1`, Standard Envelope `{ success, data, meta }`)

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | no identity required |
| GET | `/career-paths` | catalog of target careers + required skills |
| GET | `/courses?plan_id=` | curriculum courses, tagged with the skills they build |
| GET | `/skills` | skill taxonomy |
| GET | `/students/me` | current student, upserted on first call |
| POST | `/students/me/target-career-path` | `{ career_path_id }` |
| GET/POST | `/students/me/grades` | list / record a grade for a course + semester |
| PATCH/DELETE | `/students/me/grades/:id` | update / remove one of the current student's grades |
| GET | `/students/me/skill-gap-analysis` | strengths / developing / gaps vs target path |
| GET/POST | `/students/me/assessment-attempts` | score history / save a score (`career_path_id`, `score`, `total_questions`); does not store per-question answers |

For manual grade entry, POST may identify a catalog course with `course_id`, or
provide `course_code` and `course_name` to create/reuse a course by code. Both
forms also require `letter_grade` and `semester` (for example, `2569/1`).
| GET | `/students/me/roadmap` | prioritized next-step milestones |
| GET | `/certificates?skill_id=`, `/students/me/certificate-recommendations` | free-cert catalog |
| GET | `/project-ideas?skill_id=`, `/students/me/project-recommendations` | portfolio project catalog |
| GET/PUT/DELETE | `/students/me/llm-settings` | inspect metadata, save, or delete encrypted user AI API settings |
| POST | `/students/me/llm-settings/models` | list model IDs from the user's OpenAI-compatible provider |
| POST | `/documents/resume` \| `/cover-letter` \| `/portfolio` | AI-drafted with the student's configured provider; output saved per student |
| GET | `/students/me/documents`, `/students/me/documents/:id` | generation history |
| GET | `/identity` | who the verified token says is calling (`username`, `layer1_role`, `faculty`) — used by the frontend to show/hide staff-only UI |
| POST/PATCH/DELETE | `/courses` | **staff/admin only** (`StaffOnlyGuard`) — add, edit, or remove a course and its skill mapping |

## Standards compliance checklist (per CSMJU2030 conventions)

- [x] `GET /health` always present
- [x] URLs kebab-case, plural nouns
- [x] JSON fields snake_case
- [x] Standard envelope on every response (success/error)
- [x] Database-per-subsystem, frontend never touches the DB directly
- [x] No custom login page, no password, no session store of its own
- [x] JWT verified against Core Hub's JWKS on every request (issuer/audience/expiry checked)
- [x] ISO 8601 timestamps (Prisma `DateTime` default)

Assessment score history adds the `assessment_attempts` table. Apply the additive
SQL migration in `prisma/migrations/20261006110000_add_assessment_attempts/`
after the existing `career_paths` table has been created. On an existing local
database managed with Prisma, `npx prisma db push` can sync the updated schema;
review the generated SQL and use the project's normal migration process for
shared environments. Do not apply schema changes directly to production without
review.

User-supplied AI settings add the `llm_credentials` table through
`prisma/migrations/20261006230000_add_llm_credentials/`. Apply that additive
migration through the normal migration workflow in shared environments.

User AI credentials support OpenAI-compatible chat-completions providers. The
user supplies an HTTPS base URL, API key, and model ID. Credentials can be used
without persistence (sent with the generation request), encrypted and retained
until the user deletes them, or encrypted with automatic deletion after 1–365
days. Persisted keys use AES-256-GCM and require a stable
`LLM_CREDENTIALS_ENCRYPTION_KEY` containing exactly 64 hexadecimal characters.
Generate a unique value with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
put it in the backend environment, and never commit it. If this value changes,
existing saved API keys cannot be decrypted. Expired credentials are removed by
the backend cleanup task; expired keys are rejected immediately during use.

The key is sent to this subsystem's backend for the provider request. It is not
returned by settings endpoints or logged by the LLM client. On-demand mode keeps
the key only in browser memory until page reload/close and does not write it to
the database. Prompts may contain profile, grade, and form data and are sent to
the selected provider; users should review that provider's terms and costs.
The current document workflows (resume, cover letter, portfolio) use these
settings. Other AI features can reuse the same settings service and client when
they are added.
