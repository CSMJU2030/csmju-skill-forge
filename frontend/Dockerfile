# Build from the repository root so pnpm can use the workspace lockfile.
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json frontend/
COPY subsystem.yaml ./
RUN pnpm install --frozen-lockfile --filter ./frontend...

COPY frontend/ frontend/
RUN mkdir -p frontend/public

ARG BACKEND_URL=http://api:4000
ENV BACKEND_URL=$BACKEND_URL
RUN pnpm --filter ./frontend build

FROM node:22-alpine AS runner

WORKDIR /app
ARG BACKEND_URL=http://api:4000
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    BACKEND_URL=$BACKEND_URL

COPY --from=builder --chown=node:node /app/frontend/.next/standalone ./
COPY --from=builder --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder --chown=node:node /app/frontend/public ./frontend/public

USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "require('net').connect(3000,'127.0.0.1').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))"

CMD ["node", "frontend/server.js"]
