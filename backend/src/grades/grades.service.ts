import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';
import { UpsertGradeDto } from './dto/upsert-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  private ownedGradeWhere(identity: GatewayIdentity, id: string) {
    return { id, student_username: identity.username };
  }

  private async resolveCourse(dto: {
    course_id?: string;
    course_code?: string;
    course_name?: string;
  }) {
    if (dto.course_id) {
      const course = await this.prisma.course.findUnique({
        where: { id: dto.course_id },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    }

    const code = dto.course_code?.trim();
    const name = dto.course_name?.trim();
    if (!code || !name) {
      throw new BadRequestException(
        'Provide either course_id or both course_code and course_name.',
      );
    }

    return this.prisma.course.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name_th: name,
        name_en: name,
        credits: 0,
        category: 'free_elective',
      },
    });
  }

  findMine(identity: GatewayIdentity) {
    return this.prisma.grade.findMany({
      where: { student_username: identity.username },
      include: { course: true },
      orderBy: [{ semester: 'desc' }],
    });
  }

  async upsert(identity: GatewayIdentity, dto: UpsertGradeDto) {
    const course = await this.resolveCourse(dto);
    await this.prisma.student.upsert({
      where: { username: identity.username },
      update: {},
      create: { username: identity.username },
    });
    return this.prisma.grade.upsert({
      where: {
        student_username_course_id_semester: {
          student_username: identity.username,
          course_id: course.id,
          semester: dto.semester,
        },
      },
      update: { letter_grade: dto.letter_grade },
      create: {
        student_username: identity.username,
        course_id: course.id,
        letter_grade: dto.letter_grade,
        semester: dto.semester,
      },
      include: { course: true },
    });
  }

  async update(identity: GatewayIdentity, id: string, dto: UpdateGradeDto) {
    const where = this.ownedGradeWhere(identity, id);
    const existingGrade = await this.prisma.grade.findFirst({ where });
    if (!existingGrade) {
      throw new NotFoundException('Grade not found');
    }

    try {
      const course =
        dto.course_id || dto.course_code || dto.course_name
          ? await this.resolveCourse(dto)
          : undefined;
      const data: {
        course_id?: string;
        letter_grade?: string;
        semester?: string;
      } = {};
      if (course) data.course_id = course.id;
      if (dto.letter_grade !== undefined) data.letter_grade = dto.letter_grade;
      if (dto.semester !== undefined) data.semester = dto.semester;
      return await this.prisma.grade.update({
        where: { id: existingGrade.id },
        data,
        include: { course: true },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A grade for this course and semester already exists.',
        );
      }
      throw error;
    }
  }

  async remove(identity: GatewayIdentity, id: string) {
    const where = this.ownedGradeWhere(identity, id);
    const existingGrade = await this.prisma.grade.findFirst({ where });
    if (!existingGrade) {
      throw new NotFoundException('Grade not found');
    }

    await this.prisma.grade.delete({ where: { id: existingGrade.id } });
    return { id: existingGrade.id, deleted: true };
  }
}
