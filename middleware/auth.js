function requireAuth(req, res, next) {
  if (!req.session.adminUser) {
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/admin/login');
  }

  next();
}

function requireGuest(req, res, next) {
  if (req.session.adminUser) {
    return res.redirect('/admin');
  }

  next();
}

module.exports = {
  requireAuth,
  requireGuest
};
