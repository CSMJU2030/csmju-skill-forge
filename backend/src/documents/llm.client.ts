import { lookup } from 'dns/promises';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { request as httpsRequest } from 'https';
import { isIP } from 'net';
import { checkServerIdentity } from 'tls';
import { ResolvedLlmConfig } from './llm-settings.service';

interface OpenAiChatResponse {
  choices?: { message?: { content?: string | { type?: string; text?: string }[] } }[];
}

interface ProviderResponse {
  statusCode: number;
  body: string;
}

@Injectable()
export class LlmClient {
  async complete(
    systemPrompt: string,
    userPrompt: string,
    config: ResolvedLlmConfig,
  ): Promise<string> {
    const response = await this.providerRequest(config, 'chat/completions', 'POST', {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new BadGatewayException(
        this.providerErrorMessage(
          response.statusCode,
          response.body,
          false,
          config.api_key,
        ),
      );
    }

    const data = this.parseJson<OpenAiChatResponse>(response.body);
    const content = data.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
      ? content
          .filter((part) => part.type === 'text' && typeof part.text === 'string')
          .map((part) => part.text)
          .join('\n')
          .trim()
      : typeof content === 'string'
        ? content.trim()
        : '';
    if (!text) {
      throw new BadGatewayException(
        'AI provider returned no text. Verify that the selected model supports chat completions.',
      );
    }
    return text;
  }

  async listModels(config: Pick<ResolvedLlmConfig, 'base_url' | 'api_key'>): Promise<string[]> {
    const response = await this.providerRequest(config, 'models', 'GET');
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new BadGatewayException(
        this.providerErrorMessage(
          response.statusCode,
          response.body,
          true,
          config.api_key,
        ),
      );
    }

    const data = this.parseJson<{ data?: { id?: unknown }[] }>(response.body);
    return (data.data ?? [])
      .map((model) => model.id)
      .filter((id): id is string => typeof id === 'string')
      .sort((a, b) => a.localeCompare(b));
  }

  private async providerRequest(
    config: Pick<ResolvedLlmConfig, 'base_url' | 'api_key'>,
    resource: string,
    method: 'GET' | 'POST',
    payload?: object,
  ): Promise<ProviderResponse> {
    const { url, address } = await this.endpoint(config.base_url, resource);
    const body = payload ? JSON.stringify(payload) : undefined;

    return new Promise((resolve, reject) => {
      let settled = false;
      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        reject(
          new BadGatewayException(
            `Could not connect to the AI provider: ${error.message}`,
          ),
        );
      };

      const request = httpsRequest(
        {
          hostname: address,
          port: url.port ? Number(url.port) : 443,
          path: `${url.pathname}${url.search}`,
          method,
          servername: url.hostname,
          headers: {
            Host: url.host,
            Authorization: `Bearer ${config.api_key}`,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
          },
          checkServerIdentity: (_hostname, certificate) =>
            checkServerIdentity(url.hostname, certificate),
        },
        (response) => {
          const chunks: Buffer[] = [];
          let totalBytes = 0;
          response.on('data', (chunk: Buffer | string) => {
            const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            totalBytes += bytes.length;
            if (totalBytes > 2 * 1024 * 1024) {
              request.destroy(new Error('AI provider response exceeded 2 MB.'));
              return;
            }
            chunks.push(bytes);
          });
          response.on('error', fail);
          response.on('end', () => {
            if (settled) return;
            settled = true;
            resolve({
              statusCode: response.statusCode ?? 502,
              body: Buffer.concat(chunks).toString('utf8'),
            });
          });
        },
      );
      request.setTimeout(60_000, () =>
        request.destroy(new Error('AI provider request timed out.')),
      );
      request.on('error', fail);
      if (body) request.write(body);
      request.end();
    });
  }

  private async endpoint(
    baseUrl: string,
    resource: string,
  ): Promise<{ url: URL; address: string }> {
    let url: URL;
    try {
      url = new URL(baseUrl);
    } catch {
      throw new BadRequestException('Enter a valid AI provider base URL.');
    }

    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.hostname ||
      isIP(url.hostname) !== 0 ||
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.localhost') ||
      url.hostname.endsWith('.local')
    ) {
      throw new BadRequestException(
        'AI provider URL must be a public HTTPS base URL using a DNS hostname, without embedded credentials.',
      );
    }

    const resolvedAddresses = await lookup(url.hostname, {
      all: true,
      verbatim: true,
    }).catch(() => {
      throw new BadRequestException(
        'Could not resolve the AI provider host. Check the base URL.',
      );
    });
    if (
      resolvedAddresses.length === 0 ||
      resolvedAddresses.some(({ address }) => !isPublicAddress(address))
    ) {
      throw new BadRequestException(
        'AI provider URL must resolve only to public IP addresses.',
      );
    }

    url.pathname = `${url.pathname.replace(/\/+$/, '')}/${resource}`;
    return { url, address: resolvedAddresses[0].address };
  }

  private parseJson<T>(body: string): T {
    try {
      return JSON.parse(body) as T;
    } catch {
      throw new BadGatewayException(
        'AI provider returned an invalid JSON response.',
      );
    }
  }

    private providerErrorMessage(
      statusCode: number,
      body: string,
      listingModels = false,
      apiKey: string,
    ): string {
      const action = listingModels ? 'โหลดรายชื่อโมเดล' : 'เรียกใช้งาน AI';
      const advice =
        statusCode === 503
          ? 'ผู้ให้บริการขัดข้องหรือมีคำขอหนาแน่นชั่วคราว ลองใหม่ภายหลัง หรือเลือกโมเดล/ผู้ให้บริการอื่น'
          : statusCode === 429
            ? 'คำขอเกินอัตราที่กำหนดหรือโควตาหมด ตรวจสอบโควตาและการเรียกเก็บเงินกับผู้ให้บริการ'
            : statusCode === 401 || statusCode === 403
              ? 'API key ไม่ถูกต้องหรือไม่มีสิทธิ์ใช้งาน ตรวจสอบ key และสิทธิ์ของบัญชี'
              : statusCode === 404
                ? 'ไม่พบ endpoint หรือโมเดล ตรวจสอบ Base URL และโมเดลที่เลือก'
                : statusCode === 400
                  ? 'ผู้ให้บริการปฏิเสธคำขอ ตรวจสอบว่าโมเดลรองรับ API ที่เลือกและข้อมูลคำขอ'
                  : 'ตรวจสอบ Base URL, API key, โมเดล และสถานะบริการของผู้ให้บริการ';

      let detail: string | undefined;
      try {
        const response = JSON.parse(body) as {
          error?: { message?: unknown } | string;
        };
        const message =
          typeof response.error === 'string'
            ? response.error
            : response.error &&
                typeof response.error === 'object' &&
                response.error.message;
        if (typeof message === 'string') {
          detail = message
            .replace(/[\u0000-\u001f\u007f]/g, ' ')
            .split(apiKey)
            .join('[redacted]')
            .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
            .replace(/\b(sk-[A-Za-z0-9_-]{8})[A-Za-z0-9_-]*/g, '$1…')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 300);
        }
      } catch {
        // Some providers return non-JSON error pages; don't expose the response body.
      }

      return `${action}ไม่สำเร็จ (HTTP ${statusCode}) ${advice}.${detail ? ` รายละเอียดจากผู้ให้บริการ: ${detail}` : ''}`;
    }
}

function isPublicAddress(address: string): boolean {
  const version = isIP(address);
  if (version === 4) {
    const octets = address.split('.').map(Number);
    const [first, second] = octets;
    return !(
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 0) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19)) ||
      first >= 224
    );
  }
  if (version === 6) {
    const normalized = address.toLowerCase().split('%')[0];
    if (normalized.startsWith('::ffff:')) {
      const mappedAddress = normalized.slice(7);
      if (isIP(mappedAddress) === 4) return isPublicAddress(mappedAddress);
      const groups = mappedAddress.split(':');
      if (groups.length === 2) {
        const high = Number.parseInt(groups[0], 16);
        const low = Number.parseInt(groups[1], 16);
        const ipv4 = [
          high >> 8,
          high & 255,
          low >> 8,
          low & 255,
        ].join('.');
        return isPublicAddress(ipv4);
      }
      return false;
    }
    return !(
      normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      /^fe[89ab]/.test(normalized) ||
      normalized.startsWith('ff') ||
      normalized.startsWith('64:ff9b:')
    );
  }
  return false;
}
