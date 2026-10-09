export function getCookieValue(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;

    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function subsystemCookieName(suffix: 'access_token' | 'sso_state'): string {
  const subsystemId = process.env.SUBSYSTEM_ID;
  if (!subsystemId) {
    throw new Error('SUBSYSTEM_ID must be configured before authentication can be used.');
  }
  return `${subsystemId.replace(/-/g, '_')}_${suffix}`;
}
