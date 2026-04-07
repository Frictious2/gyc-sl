const sessionCookieName = 'gycsl.sid';

function getSessionCookieOptions() {
  return {
    path: '/',
    maxAge: 1000 * 60 * 60 * 8,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
}

function getClearCookieOptions() {
  const { path, httpOnly, sameSite, secure } = getSessionCookieOptions();
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
  getClearCookieOptions
};
