import { Controller, Get } from '@nestjs/common';

function healthStatus() {
  return { status: 'ok', service: 'csmju-skill-forge', time: new Date().toISOString() };
}

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return healthStatus();
  }
}

@Controller('api/health')
export class ApiHealthController {
  @Get()
  check() {
    return healthStatus();
  }
}
