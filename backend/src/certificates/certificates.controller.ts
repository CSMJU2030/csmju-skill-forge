import { Controller, Get, Query } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';

// GET /api/v1/certificates?skill_id=
// GET /api/v1/students/me/certificate-recommendations
@Controller()
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get('certificates')
  findAll(@Query('skill_id') skillId?: string) {
    return this.service.findAll(skillId);
  }

  @Get('students/me/certificate-recommendations')
  recommended(@Identity() identity: GatewayIdentity) {
    return this.service.recommendedForMe(identity);
  }
}
