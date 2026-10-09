import { Controller, Get } from '@nestjs/common';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';

// GET /api/v1/identity — lets the frontend know who's calling and what role
// they have (student vs staff/admin), purely so it can show/hide UI like the
// course-catalog admin screen. This is NOT an auth check by itself — every
// mutating endpoint re-checks the role server-side via StaffOnlyGuard.
@Controller('identity')
export class IdentityController {
  @Get()
  whoAmI(@Identity() identity: GatewayIdentity) {
    return {
      core_user_id: identity.coreUserId,
      email: identity.email,
      layer1_role: identity.layer1Role,
      subsystem_role: identity.subsystemRole,
    };
  }
}

@Controller('me')
export class MeController {
  @Get()
  whoAmI(@Identity() identity: GatewayIdentity) {
    return {
      id: identity.coreUserId,
      coreRole: identity.layer1Role,
      subsystemRole: identity.subsystemRole,
      session: { expiresAt: identity.expiresAt },
    };
  }
}
