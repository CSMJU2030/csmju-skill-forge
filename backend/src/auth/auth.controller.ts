import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { getCookieValue, subsystemCookieName } from './cookies';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('login')
  login(@Query('next') next: string | undefined, @Res() response: Response) {
    this.setNoStoreHeaders(response);
    const login = this.auth.beginLogin(next);
    response.cookie(subsystemCookieName('sso_state'), login.stateCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/callback',
      maxAge: 600_000,
    });
    return response.redirect(302, login.redirectUrl);
  }

  @Get('callback')
  async callback(
    @Query('access_token') accessToken: string | undefined,
    @Query('token_type') tokenType: string | undefined,
    @Query('state') state: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.setNoStoreHeaders(response);
    response.setHeader('Referrer-Policy', 'no-referrer');

    if (state !== undefined) {
      response.clearCookie(subsystemCookieName('sso_state'), this.cookieOptions('/auth/callback'));
    }
    if (!accessToken) {
      throw new BadRequestException('Core Hub did not return an access token.');
    }
    if (tokenType !== undefined && tokenType !== 'Bearer') {
      throw new BadRequestException('Core Hub returned an unsupported token type.');
    }
    if (state === undefined) {
      return response.redirect(302, '/auth/login');
    }

    const stateCookie = getCookieValue(
      request.headers.cookie,
      subsystemCookieName('sso_state'),
    );

    try {
      const session = await this.auth.completeCallback(
        accessToken,
        state,
        stateCookie,
      );
      const maxAge = session.identity.expiresAtEpoch * 1000 - Date.now();
      if (maxAge <= 0) {
        throw new HttpException('Core Hub access token has expired.', 401);
      }
      response.cookie(subsystemCookieName('access_token'), accessToken, {
        ...this.cookieOptions('/'),
        maxAge,
      });
      return response.redirect(302, session.next);
    } catch (error) {
      if (
        error instanceof HttpException &&
        (error.getStatus() === 401 || error.getStatus() === 403) &&
        request.accepts('html')
      ) {
        const status = error.getStatus();
        const message =
          status === 403
            ? 'บัญชีนี้ยังไม่มีสิทธิ์เข้าใช้ SkillForge'
            : 'การเข้าสู่ระบบหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง';
        return response
          .status(status)
          .type('html')
          .send(
            `<!doctype html><html lang="th"><meta charset="utf-8"><title>เข้าสู่ระบบ SkillForge</title><body><main><h1>${message}</h1><p><a href="/auth/login">เข้าสู่ระบบอีกครั้ง</a></p></main></body></html>`,
          );
      }
      throw error;
    }
  }

  @Post('logout')
  logout(@Res() response: Response) {
    this.setNoStoreHeaders(response);
    response.clearCookie(subsystemCookieName('access_token'), this.cookieOptions('/'));
    response.clearCookie(
      subsystemCookieName('sso_state'),
      this.cookieOptions('/auth/callback'),
    );
    return response.redirect(303, new URL('/logout', this.auth.getCoreHubWebUrl()).toString());
  }

  private cookieOptions(path: string) {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path,
    };
  }

  private setNoStoreHeaders(response: Response) {
    response.setHeader('Cache-Control', 'no-store');
  }
}
