import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { LlmCredential } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LlmConfigDto } from './dto/llm-config.dto';
import { SaveLlmSettingsDto } from './dto/save-llm-settings.dto';

export interface ResolvedLlmConfig {
  base_url: string;
  model: string;
  api_key: string;
}

@Injectable()
export class LlmSettingsService implements OnModuleInit, OnModuleDestroy {
  private expiryTimer?: ReturnType<typeof setInterval>;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.expiryTimer = setInterval(() => {
      void this.deleteExpired().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'unknown error';
        console.error(`Failed to delete expired LLM credentials: ${message}`);
      });
    }, 60_000);
    this.expiryTimer.unref();
  }

  onModuleDestroy() {
    if (this.expiryTimer) clearInterval(this.expiryTimer);
  }

  async findMine(studentUsername: string) {
    const credential = await this.prisma.llmCredential.findUnique({
      where: { student_username: studentUsername },
    });
    if (!credential) return null;
    if (credential.expires_at && credential.expires_at <= new Date()) {
      await this.prisma.llmCredential.delete({
        where: { student_username: studentUsername },
      });
      return null;
    }
    return this.toPublicSettings(credential);
  }

  async save(studentUsername: string, dto: SaveLlmSettingsDto) {
    if (dto.retention_mode === 'days' && dto.retention_days === undefined) {
      throw new BadRequestException(
        'retention_days is required when retention_mode is days.',
      );
    }
    if (dto.retention_mode === 'until_deleted' && dto.retention_days !== undefined) {
      throw new BadRequestException(
        'retention_days must be omitted when retention_mode is until_deleted.',
      );
    }

    const existing = await this.prisma.llmCredential.findUnique({
      where: { student_username: studentUsername },
    });
    if (!dto.api_key && !existing) {
      throw new BadRequestException(
        'กรุณากรอก API key ก่อนบันทึกการตั้งค่าครั้งแรก',
      );
    }
    if (!dto.api_key && existing?.base_url !== dto.base_url) {
      throw new BadRequestException(
        'กรุณากรอก API key ใหม่เมื่อเปลี่ยนผู้ให้บริการหรือ Base URL',
      );
    }

    await this.prisma.student.upsert({
      where: { username: studentUsername },
      update: {},
      create: { username: studentUsername },
    });
    const expiresAt =
      dto.retention_mode === 'days'
        ? new Date(Date.now() + dto.retention_days! * 24 * 60 * 60 * 1000)
        : null;
    const credential = await this.prisma.llmCredential.upsert({
      where: { student_username: studentUsername },
      update: {
        base_url: dto.base_url,
        model: dto.model.trim(),
        encrypted_key: dto.api_key
          ? this.encrypt(dto.api_key)
          : existing!.encrypted_key,
        retention_mode: dto.retention_mode,
        expires_at: expiresAt,
      },
      create: {
        student_username: studentUsername,
        base_url: dto.base_url,
        model: dto.model.trim(),
        encrypted_key: this.encrypt(dto.api_key!),
        retention_mode: dto.retention_mode,
        expires_at: expiresAt,
      },
    });
    return this.toPublicSettings(credential);
  }

  async remove(studentUsername: string) {
    const result = await this.prisma.llmCredential.deleteMany({
      where: { student_username: studentUsername },
    });
    if (result.count === 0) {
      throw new NotFoundException('No saved AI API settings were found.');
    }
    return { deleted: true };
  }

  async resolve(
    studentUsername: string,
    transientConfig?: LlmConfigDto,
  ): Promise<ResolvedLlmConfig> {
    if (transientConfig) return transientConfig;
    const credential = await this.prisma.llmCredential.findUnique({
      where: { student_username: studentUsername },
    });
    if (!credential) {
      throw new BadRequestException(
        'ตั้งค่า AI API ของคุณก่อนสร้างเอกสาร โดย API key จะถูกส่งไปยัง SkillForge เพื่อเรียกผู้ให้บริการที่คุณเลือก',
      );
    }
    if (credential.expires_at && credential.expires_at <= new Date()) {
      await this.prisma.llmCredential.delete({
        where: { student_username: studentUsername },
      });
      throw new BadRequestException(
        'AI API key หมดอายุแล้ว กรุณาตั้งค่าใหม่ก่อนสร้างเอกสาร',
      );
    }
    return {
      base_url: credential.base_url,
      model: credential.model,
      api_key: this.decrypt(credential.encrypted_key),
    };
  }

  private async deleteExpired() {
    await this.prisma.llmCredential.deleteMany({
      where: { expires_at: { lte: new Date() } },
    });
  }

  private toPublicSettings(credential: LlmCredential) {
    return {
      base_url: credential.base_url,
      model: credential.model,
      retention_mode: credential.retention_mode,
      expires_at: credential.expires_at,
      updated_at: credential.updated_at,
    };
  }

  private encryptionKey(): Buffer {
    const value = process.env.LLM_CREDENTIALS_ENCRYPTION_KEY;
    if (!value || !/^[0-9a-fA-F]{64}$/.test(value)) {
      throw new InternalServerErrorException(
        'Server credential encryption is not configured. Set LLM_CREDENTIALS_ENCRYPTION_KEY to 64 hexadecimal characters.',
      );
    }
    return Buffer.from(value, 'hex');
  }

  private encrypt(value: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey(), iv);
    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);
    return [
      'v1',
      iv.toString('base64'),
      cipher.getAuthTag().toString('base64'),
      encrypted.toString('base64'),
    ].join('.');
  }

  private decrypt(value: string): string {
    const [version, ivValue, tagValue, encryptedValue] = value.split('.');
    if (version !== 'v1' || !ivValue || !tagValue || !encryptedValue) {
      throw new InternalServerErrorException(
        'Saved AI API credentials have an unsupported encryption format.',
      );
    }
    try {
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.encryptionKey(),
        Buffer.from(ivValue, 'base64'),
      );
      decipher.setAuthTag(Buffer.from(tagValue, 'base64'));
      return Buffer.concat([
        decipher.update(Buffer.from(encryptedValue, 'base64')),
        decipher.final(),
      ]).toString('utf8');
    } catch {
      throw new InternalServerErrorException(
        'Could not decrypt saved AI API credentials. Check the server encryption key.',
      );
    }
  }
}
