const bcrypt = require('bcryptjs');
const AdminUser = require('../../models/AdminUser');

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

    req.session.adminUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    req.flash('success', 'Welcome back.');
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};
