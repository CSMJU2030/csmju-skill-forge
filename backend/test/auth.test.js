const assert = require('node:assert/strict');
const { generateKeyPairSync } = require('node:crypto');
const { test, before } = require('node:test');
const { createLocalJWKSet, exportJWK, SignJWT } = require('jose');
const { AuthService } = require('../src/auth/auth.service.ts');

let auth;
let privateKey;
let issuedAt;

before(async () => {
  process.env.SUBSYSTEM_ID = 'csmju-skill-forge';
  process.env.CORE_HUB_WEB_URL = 'https://csmju2030.jowave.com';
  process.env.CORE_HUB_ISSUER = 'core-hub';
  process.env.CORE_HUB_AUDIENCE = 'csmju2030';

  const keyPair = generateKeyPairSync('rsa', { modulusLength: 2048 });
  privateKey = keyPair.privateKey;
  const publicJwk = {
    ...(await exportJWK(keyPair.publicKey)),
    kid: 'test-key',
    use: 'sig',
    alg: 'RS256',
  };
  const keySet = createLocalJWKSet({ keys: [publicJwk] });
  auth = new AuthService({ getKeySet: () => keySet });
  issuedAt = Math.floor(Date.now() / 1000);
});

function createToken(role, options = {}) {
  const payload = { role };
  if (options.azp !== undefined) payload.azp = options.azp;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
    .setSubject('core-user-123')
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + (options.lifetime ?? 900))
    .setIssuer('core-hub')
    .setAudience('csmju2030')
    .sign(privateKey);
}

test('SSO login creates a 32-byte state and rejects unsafe next paths', () => {
  const login = auth.beginLogin('/dashboard?tab=skills');
  assert.equal(Buffer.from(login.state, 'base64url').length, 32);
  assert.equal(new URL(login.redirectUrl).pathname, '/sso/authorize');
  assert.equal(auth.validateNext('/dashboard?tab=skills'), true);
  for (const unsafePath of ['//example.com', '/\\example.com', '/auth/logout', 'https://example.com']) {
    assert.equal(auth.validateNext(unsafePath), false);
  }
  assert.equal(
    Buffer.from(auth.beginLogin('//example.com').stateCookie.split('.')[1], 'base64url').toString(),
    '/dashboard',
  );
});

test('validates the callback state and maps every registered Core role', async (t) => {
  const login = auth.beginLogin('/dashboard');
  const result = await auth.completeCallback(
    await createToken('student'),
    login.state,
    login.stateCookie,
  );
  assert.equal(result.next, '/dashboard');

  const expectedRoles = {
    student: 'STUDENT',
    alumni: 'ALUMNI',
    staff: 'STAFF',
    lecturer: 'LECTURER',
    guest: 'GUEST',
    admin: 'ADMIN',
  };

  for (const [coreRole, subsystemRole] of Object.entries(expectedRoles)) {
    await t.test(coreRole, async () => {
      const identity = await auth.verifyAccessToken(await createToken(coreRole));
      assert.equal(identity.layer1Role, coreRole);
      assert.equal(identity.subsystemRole, subsystemRole);
      assert.equal(identity.coreUserId, 'core-user-123');
    });
  }

  await assert.rejects(
    auth.completeCallback(await createToken('student'), 'incorrect-state', login.stateCookie),
    { status: 401 },
  );
});

test('rejects unsupported roles, wrong azp, and access tokens older than 15 minutes', async () => {
  await assert.rejects(auth.verifyAccessToken(await createToken('unknown-role')), { status: 403 });
  await assert.rejects(
    auth.verifyAccessToken(await createToken('student', { azp: 'another-subsystem' })),
    { status: 401 },
  );
  await assert.rejects(
    auth.verifyAccessToken(await createToken('student', { lifetime: 1000 })),
    { status: 401 },
  );
});
