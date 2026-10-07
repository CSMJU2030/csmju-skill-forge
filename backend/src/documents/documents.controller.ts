import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Identity } from '../common/decorators/gateway-identity.decorator';
import { GatewayIdentity } from '../common/types/identity';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { GeneratePortfolioDto } from './dto/generate-portfolio.dto';
import { SaveLlmSettingsDto } from './dto/save-llm-settings.dto';
import { ListLlmModelsDto } from './dto/list-llm-models.dto';
import { LlmClient } from './llm.client';
import { LlmSettingsService } from './llm-settings.service';

// POST /api/v1/documents/resume
// POST /api/v1/documents/cover-letter
// POST /api/v1/documents/portfolio
// GET  /api/v1/students/me/documents
// GET  /api/v1/students/me/documents/:id
// POST /api/v1/students/me/documents/upload-transcript
@Controller()
export class DocumentsController {
  constructor(
    private readonly service: DocumentsService,
    private readonly llm: LlmClient,
    private readonly llmSettings: LlmSettingsService,
  ) {}

  @Get('students/me/llm-settings')
  findLlmSettings(@Identity() identity: GatewayIdentity) {
    return this.llmSettings.findMine(identity.username);
  }

  @Put('students/me/llm-settings')
  saveLlmSettings(
    @Identity() identity: GatewayIdentity,
    @Body() dto: SaveLlmSettingsDto,
  ) {
    return this.llmSettings.save(identity.username, dto);
  }

  @Delete('students/me/llm-settings')
  deleteLlmSettings(@Identity() identity: GatewayIdentity) {
    return this.llmSettings.remove(identity.username);
  }

  @Post('students/me/llm-settings/models')
  listLlmModels(
    @Identity() identity: GatewayIdentity,
    @Body() dto: ListLlmModelsDto,
  ) {
    if (!dto.base_url && !dto.api_key) {
      return this.llmSettings
        .resolve(identity.username)
        .then(({ base_url, api_key }) =>
          this.llm.listModels({ base_url, api_key }),
        );
    }
    if (!dto.base_url || !dto.api_key) {
      throw new BadRequestException(
        'Provide both base_url and api_key, or omit both to use saved settings.',
      );
    }
    return this.llm.listModels({
      base_url: dto.base_url,
      api_key: dto.api_key,
    });
  }

  @Post('documents/resume')
  resume(@Identity() identity: GatewayIdentity, @Body() dto: GenerateResumeDto) {
    return this.service.generateResume(identity, dto);
  }

  @Post('documents/cover-letter')
  coverLetter(@Identity() identity: GatewayIdentity, @Body() dto: GenerateCoverLetterDto) {
    return this.service.generateCoverLetter(identity, dto);
  }

  @Post('documents/portfolio')
  portfolio(@Identity() identity: GatewayIdentity, @Body() dto: GeneratePortfolioDto) {
    return this.service.generatePortfolio(identity, dto);
  }

  @Get('students/me/documents')
  findMine(@Identity() identity: GatewayIdentity) {
    return this.service.findMine(identity);
  }

  @Get('students/me/documents/:id')
  findOne(@Identity() identity: GatewayIdentity, @Param('id') id: string) {
    return this.service.findOneOrThrow(identity, id);
  }

  /**
   * API สำหรับรับอัปโหลดไฟล์ PDF เพื่อสแกนและสกัดข้อมูลเกรดวิชาเรียนลงฐานข้อมูล
   * Route: POST /students/me/documents/upload-transcript
   */
  @Post('students/me/documents/upload-transcript')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTranscript(
    @Identity() identity: GatewayIdentity,
    @UploadedFile() file: any, // แก้ไขจุดนี้เป็น any เพื่อเคลียร์ Error ข้อจำกัด Namespace Express.Multer
  ) {
    if (!file) {
      throw new BadRequestException('กรุณาเลือกไฟล์ PDF ผลการเรียนเพื่ออัปโหลด');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('ระบบรองรับการสแกนเฉพาะไฟล์รูปแบบ PDF (.pdf) เท่านั้น');
    }

    return this.service.extractDataFromPdf(identity, file.buffer);
  }
}
