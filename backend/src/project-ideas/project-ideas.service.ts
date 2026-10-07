import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';
import { GapAnalysisService } from '../gap-analysis/gap-analysis.service';

@Injectable()
export class ProjectIdeasService {
  constructor(private prisma: PrismaService, private gapAnalysis: GapAnalysisService) {}

  findAll(skillId?: string) {
    return this.prisma.projectIdea.findMany({
      where: skillId ? { skills: { some: { skill_id: skillId } } } : undefined,
      include: { skills: { include: { skill: true } } },
      orderBy: { title: 'asc' },
    });
  }

  async recommendedForMe(identity: GatewayIdentity) {
    const gap = await this.gapAnalysis.computeSkillGap(identity);
    if (!gap) return [];
    const weakSkillIds = [...gap.gaps, ...gap.developing].map((e) => e.skill_id);
    if (weakSkillIds.length === 0) return [];
    return this.prisma.projectIdea.findMany({
      where: { skills: { some: { skill_id: { in: weakSkillIds } } } },
      include: { skills: { include: { skill: true } } },
    });
  }
}
