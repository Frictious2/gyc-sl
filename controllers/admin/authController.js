const bcrypt = require('bcryptjs');
const AdminUser = require('../../models/AdminUser');
const { sessionCookieName, getClearCookieOptions } = require('../../config/session');

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

exports.showLogin = (req, res) => {
  res.render('admin/auth/login', {
    layout: 'layouts/admin',
    title: 'Admin Login'
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await AdminUser.findByEmail(email);
    const user = users[0];

    if (!user) {
      req.flash('error', 'Invalid login credentials.');
      return res.redirect('/admin/login');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      req.flash('error', 'Invalid login credentials.');
      return res.redirect('/admin/login');
    }

    await regenerateSession(req);

    req.session.adminUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    req.flash('success', 'Welcome back.');
    await saveSession(req);
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (!req.session) {
      res.clearCookie(sessionCookieName, getClearCookieOptions());
      return res.redirect('/admin/login');
    }

    await destroySession(req);
    res.clearCookie(sessionCookieName, getClearCookieOptions());
    res.redirect('/admin/login');
  } catch (error) {
    next(error);
  }
};
