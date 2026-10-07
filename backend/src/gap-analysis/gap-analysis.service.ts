import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';

const GRADE_POINTS: Record<string, number> = {
  A: 4, 'B+': 3.5, B: 3, 'C+': 2.5, C: 2, 'D+': 1.5, D: 1, F: 0,
};

export interface SkillGapEntry {
  skill_id: string;
  skill_name: string;
  category: string;
  importance_level: number;   // 1-5, from the target career path
  proficiency_score: number;  // 0-5, derived from grades in mapped courses
  readiness_percent: number;  // proficiency vs importance, capped at 100
  status: 'strength' | 'developing' | 'gap';
  contributing_courses: { code: string; name_en: string; letter_grade: string }[];
}

export interface SkillGapResult {
  career_path_id: string;
  career_path_name: string;
  overall_readiness_percent: number;
  strengths: SkillGapEntry[];
  gaps: SkillGapEntry[];
  developing: SkillGapEntry[];
}

@Injectable()
export class GapAnalysisService {
  constructor(private prisma: PrismaService) {}

  async computeSkillGap(identity: GatewayIdentity): Promise<SkillGapResult | null> {
    const student = await this.prisma.student.findUnique({
      where: { username: identity.username },
      include: { target_career_path: { include: { skills: { include: { skill: true } } } } },
    });
    if (!student?.target_career_path) return null;

    const grades = await this.prisma.grade.findMany({
      where: { student_username: identity.username, letter_grade: { not: 'W' } },
      include: { course: { include: { course_skills: true } } },
    });

    const entries: SkillGapEntry[] = [];
    let weightedReadinessSum = 0;
    let importanceSum = 0;

    for (const cps of student.target_career_path.skills) {
      let weightedPoints = 0;
      let weightTotal = 0;
      const contributing: SkillGapEntry['contributing_courses'] = [];

      for (const g of grades) {
        const courseSkill = g.course.course_skills.find((cs) => cs.skill_id === cps.skill_id);
        if (!courseSkill) continue;
        const gradePoint = GRADE_POINTS[g.letter_grade] ?? 0;
        weightedPoints += gradePoint * courseSkill.weight;
        weightTotal += courseSkill.weight;
        contributing.push({ code: g.course.code, name_en: g.course.name_en, letter_grade: g.letter_grade });
      }

      const proficiencyScore = weightTotal > 0 ? (weightedPoints / weightTotal / 4) * 5 : 0;
      const readinessPercent = Math.min(100, Math.round((proficiencyScore / cps.importance_level) * 100));

      let status: SkillGapEntry['status'] = 'gap';
      if (readinessPercent >= 80) status = 'strength';
      else if (readinessPercent >= 50) status = 'developing';

      entries.push({
        skill_id: cps.skill_id,
        skill_name: cps.skill.name,
        category: cps.skill.category,
        importance_level: cps.importance_level,
        proficiency_score: Math.round(proficiencyScore * 10) / 10,
        readiness_percent: readinessPercent,
        status,
        contributing_courses: contributing,
      });

      weightedReadinessSum += readinessPercent * cps.importance_level;
      importanceSum += cps.importance_level;
    }

    const overallReadiness = importanceSum > 0 ? Math.round(weightedReadinessSum / importanceSum) : 0;

    entries.sort((a, b) => a.readiness_percent - b.readiness_percent);

    return {
      career_path_id: student.target_career_path.id,
      career_path_name: student.target_career_path.name,
      overall_readiness_percent: overallReadiness,
      strengths: entries.filter((e) => e.status === 'strength'),
      developing: entries.filter((e) => e.status === 'developing'),
      gaps: entries.filter((e) => e.status === 'gap'),
    };
  }

  // Keep strengths on the roadmap as completed milestones instead of dropping
  // them when they no longer count as gaps.
  async buildRoadmap(identity: GatewayIdentity) {
    const gap = await this.computeSkillGap(identity);
    if (!gap) return null;

    const priority = [
      ...[...gap.gaps, ...gap.developing].slice(0, 6),
      ...gap.strengths,
    ];
    const takenCourseIds = new Set(
      (
        await this.prisma.grade.findMany({
          where: { student_username: identity.username },
          select: { course_id: true },
        })
      ).map((g) => g.course_id),
    );

    const milestones: Array<{
      skill_id: string;
      skill_name: string;
      readiness_percent: number;
      importance_level: number;
      recommended_courses: { code: string; name_en: string; name_th: string }[];
      recommended_certificates: { name: string; provider: string; url: string; effort_hours: number | null }[];
      recommended_projects: { title: string; description: string; difficulty: string }[];
    }> = [];
    for (const entry of priority) {
      const [courses, certificates, projects] = await Promise.all([
        this.prisma.course.findMany({
          where: { course_skills: { some: { skill_id: entry.skill_id } }, id: { notIn: [...takenCourseIds] } },
          include: { course_skills: true },
          take: 2,
        }),
        this.prisma.certificate.findMany({
          where: { skills: { some: { skill_id: entry.skill_id } } },
          take: 2,
        }),
        this.prisma.projectIdea.findMany({
          where: { skills: { some: { skill_id: entry.skill_id } } },
          take: 2,
        }),
      ]);

      milestones.push({
        skill_id: entry.skill_id,
        skill_name: entry.skill_name,
        readiness_percent: entry.readiness_percent,
        importance_level: entry.importance_level,
        recommended_courses: courses.map((c) => ({ code: c.code, name_en: c.name_en, name_th: c.name_th })),
        recommended_certificates: certificates.map((c) => ({ name: c.name, provider: c.provider, url: c.url, effort_hours: c.effort_hours })),
        recommended_projects: projects.map((p) => ({ title: p.title, description: p.description, difficulty: p.difficulty })),
      });
    }

    return {
      career_path_name: gap.career_path_name,
      overall_readiness_percent: gap.overall_readiness_percent,
      milestones,
    };
  }
}
