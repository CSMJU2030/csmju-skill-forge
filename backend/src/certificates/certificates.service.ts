import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';
import { GapAnalysisService } from '../gap-analysis/gap-analysis.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService, private gapAnalysis: GapAnalysisService) {}

  findAll(skillId?: string) {
    return this.prisma.certificate.findMany({
      where: skillId ? { skills: { some: { skill_id: skillId } } } : undefined,
      include: { skills: { include: { skill: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async recommendedForMe(identity: GatewayIdentity) {
    const gap = await this.gapAnalysis.computeSkillGap(identity);
    if (!gap) return [];
    const weakSkillIds = [...gap.gaps, ...gap.developing].map((e) => e.skill_id);
    if (weakSkillIds.length === 0) return [];
    return this.prisma.certificate.findMany({
      where: { skills: { some: { skill_id: { in: weakSkillIds } } } },
      include: { skills: { include: { skill: true } } },
      orderBy: { effort_hours: 'asc' },
    });
  }
}
