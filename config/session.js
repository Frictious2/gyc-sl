const sessionCookieName = 'gycsl.sid';

function getCookieSecureMode() {
  if (process.env.SESSION_COOKIE_SECURE) {
    return process.env.SESSION_COOKIE_SECURE;
  }

  return process.env.NODE_ENV === 'production' ? 'auto' : 'false';
}

function resolveSecureCookie(req) {
  const secureMode = String(getCookieSecureMode()).toLowerCase();

  if (secureMode === 'true') {
    return true;
  }

  if (secureMode === 'false') {
    return false;
  }

  if (secureMode === 'auto') {
    if (!req) {
      return 'auto';
    }

    return Boolean(
      req.secure ||
        req.headers['x-forwarded-proto'] === 'https' ||
        req.headers['x-forwarded-ssl'] === 'on'
    );
  }

  return false;
}

function getTrustProxySetting() {
  const value = process.env.TRUST_PROXY;

  if (value === undefined || value === '') {
    return process.env.NODE_ENV === 'production' ? 1 : false;
  }

  if (value === 'true') {
    return 1;
  }

  if (value === 'false') {
    return false;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : value;
}

function getSessionCookieOptions(req) {
  return {
    path: '/',
    maxAge: 1000 * 60 * 60 * 8,
    httpOnly: true,
    sameSite: process.env.SESSION_COOKIE_SAME_SITE || 'lax',
    secure: resolveSecureCookie(req)
  };
}

function getClearCookieOptions(req) {
  const { path, httpOnly, sameSite, secure } = getSessionCookieOptions(req);
  return {
    path,
    httpOnly,
    sameSite,
    secure
  };
}

module.exports = {
  sessionCookieName,
  getSessionCookieOptions,
  getClearCookieOptions,
  getTrustProxySetting
};
