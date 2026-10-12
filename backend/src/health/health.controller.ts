import { Controller, Get } from '@nestjs/common';

// Keep the versioned health endpoint and expose the Core Hub monitor alias.
@Controller(['health', 'api/health'])
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'csmju-skill-forge', time: new Date().toISOString() };
  }
}
