import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // Gets-or-creates the local student row. Only local, subsystem-specific data
  // (target_career_path_id) lives here — username/role/faculty are never stored,
  // they're re-read from the Gateway headers on every request (data-dictionary.md).
  async getOrCreate(identity: GatewayIdentity) {
    return this.prisma.student.upsert({
      where: { username: identity.coreUserId },
      update: {},
      create: { username: identity.coreUserId },
      include: { target_career_path: true },
    });
  }

  async setTargetCareerPath(identity: GatewayIdentity, careerPathId: string) {
    await this.getOrCreate(identity);
    return this.prisma.student.update({
      where: { username: identity.coreUserId },
      data: { target_career_path_id: careerPathId },
      include: { target_career_path: true },
    });
  }
}
