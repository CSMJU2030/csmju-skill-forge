import type { Request } from 'express';

export const CORE_ROLE_TO_SUBSYSTEM_ROLE = {
  student: 'STUDENT',
  alumni: 'ALUMNI',
  staff: 'STAFF',
  lecturer: 'LECTURER',
  guest: 'GUEST',
  admin: 'ADMIN',
} as const;

export type CoreRole = keyof typeof CORE_ROLE_TO_SUBSYSTEM_ROLE;
export type SubsystemRole = (typeof CORE_ROLE_TO_SUBSYSTEM_ROLE)[CoreRole];

export interface GatewayIdentity {
  coreUserId: string;
  email?: string;
  layer1Role: CoreRole;
  subsystemRole: SubsystemRole;
  expiresAt: string;
  expiresAtEpoch: number;
}

export interface AuthenticatedRequest extends Request {
  identity?: GatewayIdentity;
  authFailure?: 'unauthorized' | 'forbidden';
}
