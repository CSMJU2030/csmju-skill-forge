import { Controller, Get } from '@nestjs/common';

// api-conventions.md: "ต้องมี Endpoint GET /health สำหรับตรวจสถานะระบบเสมอ"
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'csmju-skillforge', time: new Date().toISOString() };
  }
}
