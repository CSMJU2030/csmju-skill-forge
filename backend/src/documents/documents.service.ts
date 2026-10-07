import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayIdentity } from '../common/types/identity';
import { GapAnalysisService } from '../gap-analysis/gap-analysis.service';
import { LlmClient } from './llm.client';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { GeneratePortfolioDto } from './dto/generate-portfolio.dto';
import { PDFParse } from 'pdf-parse';
import { LlmSettingsService } from './llm-settings.service';

// กำหนดโครงสร้าง Interface สำหรับรองรับวิชาที่สกัดได้จาก Regex ของเอกสาร MJU
interface ExtractedCourse {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  semester: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private gapAnalysis: GapAnalysisService,
    private llm: LlmClient,
    private llmSettings: LlmSettingsService,
  ) {}

  findMine(identity: GatewayIdentity) {
    return this.prisma.generatedDocument.findMany({
      where: { student_username: identity.username },
      orderBy: { created_at: 'desc' },
    });
  }

  private async studentContext(identity: GatewayIdentity) {
    const [gap, grades] = await Promise.all([
      this.gapAnalysis.computeSkillGap(identity),
      this.prisma.grade.findMany({
        where: {
          student_username: identity.username,
          letter_grade: { not: 'W' },
        },
        include: { course: true },
      }),
    ]);
    return { gap, grades };
  }

  async generateResume(identity: GatewayIdentity, dto: GenerateResumeDto) {
    const { gap, grades } = await this.studentContext(identity);
    const targetRole =
      dto.target_role || gap?.career_path_name || 'the target role';

    const system =
      'You are a career-services writing assistant for computer-science undergraduates in Thailand. ' +
      'Write clean, ATS-friendly resumes in Markdown. Be concrete and specific; never invent employers, ' +
      'dates, or achievements that were not given to you — use coursework and skill strengths for a student ' +
      'with limited work experience instead of fabricating jobs.';

    const userPrompt = [
      `Write a one-page resume in Markdown for a CS student applying for: ${targetRole}.`,
      `Name: ${dto.full_name}`,
      `Contact: ${dto.email}${dto.phone ? ' | ' + dto.phone : ''}`,
      gap
        ? `Career-readiness strengths: ${gap.strengths.map((s) => s.skill_name).join(', ') || 'none yet'}`
        : '',
      gap
        ? `Skills currently developing: ${gap.developing.map((s) => s.skill_name).join(', ') || 'none'}`
        : '',
      `Relevant coursework: ${grades.map((g) => `${g.course.name_en} (${g.letter_grade})`).join(', ') || 'not provided'}`,
      dto.highlights?.length
        ? `Additional experience/highlights the student wants included:\n- ${dto.highlights.join('\n- ')}`
        : '',
      'Sections: Header, Summary (2-3 lines), Skills, Relevant Coursework, Projects/Experience (only if highlights were given, otherwise omit), Education.',
    ]
      .filter(Boolean)
      .join('\n');

    const llmConfig = await this.llmSettings.resolve(
      identity.username,
      dto.llm_config,
    );
    const content = await this.llm.complete(system, userPrompt, llmConfig);
    return this.save(
      identity,
      'resume',
      `Resume - ${targetRole}`,
      content,
      targetRole,
    );
  }

  async generateCoverLetter(
    identity: GatewayIdentity,
    dto: GenerateCoverLetterDto,
  ) {
    const { gap } = await this.studentContext(identity);
    const targetRole =
      dto.target_role || gap?.career_path_name || 'the position';

    const system =
      'You are a career-services writing assistant. Write a concise, sincere one-page cover letter in Markdown ' +
      '(3-4 short paragraphs). Avoid generic filler ("I am writing to express my interest..."); open with something ' +
      "specific about the applicant's actual strengths or the role.";

    const userPrompt = [
      `Applicant: ${dto.full_name} (${dto.email})`,
      `Company: ${dto.company_name}`,
      `Role: ${targetRole}`,
      dto.hiring_manager_name
        ? `Addressed to: ${dto.hiring_manager_name}`
        : 'Addressed to: the hiring team',
      gap
        ? `Career-readiness strengths to lean on: ${gap.strengths.map((s) => s.skill_name).join(', ') || 'coursework-based fundamentals'}`
        : '',
      dto.why_interested
        ? `Why the student is interested: ${dto.why_interested}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const llmConfig = await this.llmSettings.resolve(
      identity.username,
      dto.llm_config,
    );
    const content = await this.llm.complete(system, userPrompt, llmConfig);
    return this.save(
      identity,
      'cover_letter',
      `Cover Letter - ${dto.company_name}`,
      content,
      targetRole,
    );
  }

  async generatePortfolio(
    identity: GatewayIdentity,
    dto: GeneratePortfolioDto,
  ) {
    const { gap } = await this.studentContext(identity);
    let projectTitles: string[] = dto.project_titles ?? [];
    if (projectTitles.length === 0) {
      const recommended = await this.prisma.projectIdea.findMany({ take: 3 });
      projectTitles = recommended.map((p) => p.title);
    }

    const system =
      'You are a portfolio-site copywriter for a CS student. Write Markdown content for a personal portfolio page: ' +
      'an intro/tagline section and one short write-up per project (what it does, why it matters, tech used). ' +
      'Keep each project write-up under 80 words.';

    const userPrompt = [
      `Name: ${dto.full_name}`,
      dto.tagline
        ? `Tagline: ${dto.tagline}`
        : `Target career path: ${gap?.career_path_name || 'Software/Security Engineering'}`,
      `Projects to feature: ${projectTitles.join(', ')}`,
      gap
        ? `Key strengths to weave in: ${gap.strengths.map((s) => s.skill_name).join(', ') || 'core CS fundamentals'}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const llmConfig = await this.llmSettings.resolve(
      identity.username,
      dto.llm_config,
    );
    const content = await this.llm.complete(system, userPrompt, llmConfig);
    return this.save(
      identity,
      'portfolio',
      `Portfolio - ${dto.full_name}`,
      content,
      gap?.career_path_name,
    );
  }

  private async save(
    identity: GatewayIdentity,
    docType: string,
    title: string,
    content: string,
    targetRole?: string,
  ) {
    await this.prisma.student.upsert({
      where: { username: identity.username },
      update: {},
      create: { username: identity.username },
    });
    return this.prisma.generatedDocument.create({
      data: {
        student_username: identity.username,
        doc_type: docType,
        title,
        content_markdown: content,
        target_role: targetRole,
      },
    });
  }

  async findOneOrThrow(identity: GatewayIdentity, id: string) {
    const doc = await this.prisma.generatedDocument.findUnique({
      where: { id },
    });
    if (!doc || doc.student_username !== identity.username) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }

  /**
   * สแกนไฟล์ PDF ผลการเรียน แตกข้อมูลดิบโดยใช้ Regex สำหรับโครงสร้างทรานสคริปต์ของ ม.แม่โจ้ (MJU)
   */
  async extractDataFromPdf(
    identity: GatewayIdentity,
    fileBuffer: Buffer,
  ): Promise<any> {
    try {
      const parser = new PDFParse({ data: fileBuffer });
      let rawText: string;
      try {
        const pdfData = await parser.getText();
        rawText = pdfData.text;
      } finally {
        await parser.destroy();
      }

      if (!rawText || rawText.trim().length === 0) {
        throw new Error(
          'ไม่สามารถประมวลผลข้อความจาก PDF ได้ กรุณาตรวจสอบว่าเป็น Digital PDF',
        );
      }

      const extractedCourses: ExtractedCourse[] = [];
      const lines = rawText
        .replace(/\0/g, '')
        .split(/\r?\n/)
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      const courseRowRegex =
        /^(\d{5,8})\s+(.+?)\s+(\d+)\s+(A\+?|B\+?|C\+?|D\+?|F|W|S)$/;
      const courseCodeRegex = /^\d{5,8}\s/;
      let semester = '';

      for (let i = 0; i < lines.length; i += 1) {
        const semesterMatch = lines[i].match(/(\d)\s*\/\s*((?:25|20)\d{2})/);
        if (semesterMatch) {
          semester = `${semesterMatch[2]}/${semesterMatch[1]}`;
          continue;
        }

        if (!courseCodeRegex.test(lines[i])) {
          continue;
        }

        let row = lines[i];
        let match = row.match(courseRowRegex);
        while (!match && i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (
            courseCodeRegex.test(nextLine) ||
            /^(?:ภาคการศึกษาที่|THIS SEMESTER|CUMULATIVE|C\.Register|C\.Earn|CA|GP|GPA)\b/i.test(
              nextLine,
            )
          ) {
            break;
          }

          row += ` ${nextLine}`;
          i += 1;
          match = row.match(courseRowRegex);
        }

        if (!match || !semester) {
          continue;
        }

        extractedCourses.push({
          courseCode: match[1],
          courseName: match[2].trim(),
          credits: parseInt(match[3], 10),
          grade: match[4],
          semester,
        });
      }

      if (extractedCourses.length === 0) {
        throw new Error(
          'ไม่พบข้อมูลรายวิชาและเกรดที่ตรงตามรูปแบบโครงสร้างระบบทะเบียน ม.แม่โจ้ ในไฟล์ PDF นี้',
        );
      }

      // 3. จัดการบันทึกข้อมูลเข้าสู่ฐานข้อมูลด้วย Prisma
      await this.prisma.student.upsert({
        where: { username: identity.username },
        update: {},
        create: { username: identity.username },
      });

      for (const item of extractedCourses) {
        // ค้นหาหรือเพิ่มวิชาเรียนใหม่เข้าไปในระบบฐานข้อมูล (ใช้หน่วยกิตจริงจาก PDF)
        const course = await this.prisma.course.upsert({
          where: { code: item.courseCode },
          update: { name_th: item.courseName },
          create: {
            code: item.courseCode,
            name_th: item.courseName,
            name_en: item.courseName,
            credits: item.credits, // บันทึกหน่วยกิตจริงที่ดึงได้จากใบเกรด (เช่น 3 หน่วยกิต)
            category: 'Major Requirements',
          },
        });

        // ตรวจสอบเกรดเดิมของวิชาในภาคการศึกษาเดียวกัน
        const existingGrade = await this.prisma.grade.findFirst({
          where: {
            student_username: identity.username,
            course_id: course.id,
            semester: item.semester,
          },
        });

        if (existingGrade) {
          // หากมีข้อมูลเกรดอยู่แล้ว ให้ดำเนินการอัปเดตเกรดใหม่ทันที
          await this.prisma.grade.update({
            where: { id: existingGrade.id },
            data: { letter_grade: item.grade },
          });
        } else {
          // หากไม่เคยเรียนวิชานี้มาก่อน ให้สร้างบันทึกเกรดใหม่เข้าระบบ
          await this.prisma.grade.create({
            data: {
              student_username: identity.username,
              course_id: course.id,
              letter_grade: item.grade,
              semester: item.semester,
            },
          });
        }
      }

      return {
        success: true,
        studentName: identity.username,
        coursesExtractedCount: extractedCourses.length,
      };
    } catch (error: any) {
      throw new Error(
        `การสกัดข้อมูลรูปแบบ Fixed PDF ล้มเหลว: ${error.message}`,
      );
    }
  }
}