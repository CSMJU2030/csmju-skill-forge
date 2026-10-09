import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createRemoteJWKSet } from 'jose';

// Wraps the Core Hub's published JWKS endpoint (CORE_HUB_JWKS_URL) with jose's
// built-in remote-key cache. The three timing envs map directly onto jose's
// own cache knobs — this is exactly the client jose expects to back a
// createRemoteJWKSet call, which is presumably why Core specified them this way:
//   JWKS_CACHE_TTL_MS          -> cacheMaxAge     (how long a fetched key set is trusted)
//   JWKS_MIN_REFRESH_INTERVAL_MS -> cooldownDuration (min gap between refetches on a cache miss)
//   JWKS_REQUEST_TIMEOUT_MS    -> timeoutDuration (HTTP timeout on the JWKS fetch itself)
@Injectable()
export class JwksService implements OnModuleInit {
  private readonly logger = new Logger(JwksService.name);
  private keySet?: ReturnType<typeof createRemoteJWKSet>;

  onModuleInit() {
    const jwksUrl = process.env.CORE_HUB_JWKS_URL;
    if (!jwksUrl) {
      this.logger.warn('CORE_HUB_JWKS_URL is not set — JWT verification will fail until it is.');
      return;
    }
    this.keySet = createRemoteJWKSet(new URL(jwksUrl), {
      cacheMaxAge: Number(process.env.JWKS_CACHE_TTL_MS ?? 600_000),
      cooldownDuration: Number(process.env.JWKS_MIN_REFRESH_INTERVAL_MS ?? 30_000),
      timeoutDuration: Number(process.env.JWKS_REQUEST_TIMEOUT_MS ?? 5_000),
    });
  }

  getKeySet() {
    if (!this.keySet) {
      throw new Error('JWKS key set not initialized — is CORE_HUB_JWKS_URL set?');
    }
    return this.keySet;
  }
}
