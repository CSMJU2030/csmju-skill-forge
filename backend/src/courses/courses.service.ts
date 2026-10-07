import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// Prisma error codes we handle here, checked by duck-typing `.code` rather
// than `instanceof Prisma.PrismaClientKnownRequestError` — keeps this file
// independent of the exact generated-client shape.
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';
const FOREIGN_KEY_CONSTRAINT_VIOLATION = 'P2003';

function prismaErrorCode(e: unknown): string | undefined {
  return typeof e === 'object' && e !== null && 'code' in e ? (e as { code?: string }).code : undefined;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findAll(planId?: string) {
    return this.prisma.course.findMany({
      where: planId ? { plan_id: planId } : undefined,
      include: { course_skills: { include: { skill: true } }, plan: true },
      orderBy: { code: 'asc' },
    });
  }

  async findOneOrThrow(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { course_skills: { include: { skill: true } }, plan: true },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(dto: CreateCourseDto) {
    try {
      const course = await this.prisma.course.create({
        data: {
          code: dto.code,
          name_th: dto.name_th,
          name_en: dto.name_en,
          credits: dto.credits,
          category: dto.category,
          plan_id: dto.plan_id,
        },
      });
      if (dto.skill_weights?.length) {
        await this.prisma.courseSkill.createMany({
          data: dto.skill_weights.map((sw) => ({ course_id: course.id, skill_id: sw.skill_id, weight: sw.weight })),
        });
      }
      return this.findOneOrThrow(course.id);
    } catch (e) {
      if (prismaErrorCode(e) === UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException(`Course code "${dto.code}" already exists.`);
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findOneOrThrow(id);
    try {
      await this.prisma.course.update({
        where: { id },
        data: {
          code: dto.code,
          name_th: dto.name_th,
          name_en: dto.name_en,
          credits: dto.credits,
          category: dto.category,
          plan_id: dto.plan_id,
        },
      });
      if (dto.skill_weights) {
        await this.prisma.courseSkill.deleteMany({ where: { course_id: id } });
        if (dto.skill_weights.length) {
          await this.prisma.courseSkill.createMany({
            data: dto.skill_weights.map((sw) => ({ course_id: id, skill_id: sw.skill_id, weight: sw.weight })),
          });
        }
      }
      return this.findOneOrThrow(id);
    } catch (e) {
      if (prismaErrorCode(e) === UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException(`Course code "${dto.code}" already exists.`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    try {
      await this.prisma.course.delete({ where: { id } });
      return { id, deleted: true };
    } catch (e) {
      if (prismaErrorCode(e) === FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new ConflictException(
          'This course has grades recorded against it and cannot be deleted. Remove those grades first.',
        );
      }
      throw e;
    }
  }
}
