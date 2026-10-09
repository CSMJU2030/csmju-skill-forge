import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const subsystemId = process.env.SUBSYSTEM_ID;
  if (!subsystemId) throw new Error('SUBSYSTEM_ID must be configured.');

  const cookieName = `${subsystemId.replace(/-/g, '_')}_access_token`;
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!request.cookies.has(cookieName)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-skillforge-path', currentPath);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/|api/).*)'],
};
