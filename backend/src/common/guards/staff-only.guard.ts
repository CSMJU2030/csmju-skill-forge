import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/identity';

// The course/skill catalog is owned by the department, not by any one
// student — "ระบบขึ้นกับบัญชีของสาขาหลัก ไม่ใช่ของคนๆ เดียว". Any account
// the Core marks as staff or admin (Layer 1 role) can manage it; students
// and alumni can only read it. This is enforced here, server-side, on every
// mutating request — never trust a frontend-only check.
@Injectable()
export class StaffOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (req.authFailure === 'forbidden') {
      throw new ForbiddenException('This Core Hub role is not enabled for SkillForge.');
    }
    const identity = req.identity;
    if (!identity) {
      throw new UnauthorizedException('Missing Gateway identity headers.');
    }
    if (!['STAFF', 'ADMIN'].includes(identity.subsystemRole)) {
      throw new ForbiddenException(
        'Only a department staff/admin account can add, edit, or remove courses.',
      );
    }
    return true;
  }
}
