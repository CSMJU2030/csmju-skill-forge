import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';
import { CreateAssessmentAttemptDto } from './dto/create-assessment-attempt.dto';

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  history(identity: GatewayIdentity, careerPathId?: string) {
    return this.prisma.assessmentAttempt.findMany({
      where: {
        student_username: identity.username,
        ...(careerPathId ? { career_path_id: careerPathId } : {}),
      },
      select: {
        id: true,
        career_path_id: true,
        score: true,
        total_questions: true,
        created_at: true,
        career_path: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async createAttempt(identity: GatewayIdentity, dto: CreateAssessmentAttemptDto) {
    if (dto.score > dto.total_questions) {
      throw new BadRequestException('Score cannot exceed total questions.');
    }

    const careerPath = await this.prisma.careerPath.findUnique({
      where: { id: dto.career_path_id },
      select: { id: true },
    });
    if (!careerPath) {
      throw new NotFoundException('Career path not found.');
    }

    return this.prisma.assessmentAttempt.create({
      data: {
        student_username: identity.username,
        career_path_id: careerPath.id,
        score: dto.score,
        total_questions: dto.total_questions,
      },
      select: {
        id: true,
        career_path_id: true,
        score: true,
        total_questions: true,
        created_at: true,
      },
    });
  }
}
