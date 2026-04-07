module.exports = (req, res, next) => {
  const session = req.session || null;
  const formErrors = (session && session.formErrors) || {};
  const oldInput = (session && session.oldInput) || {};

  if (session) {
    session.formErrors = null;
    session.oldInput = null;
  }

  res.locals.currentPath = req.path;
  res.locals.adminUser = (session && session.adminUser) || null;
  res.locals.successMessages = typeof req.flash === 'function' ? req.flash('success') : [];
  res.locals.errorMessages = typeof req.flash === 'function' ? req.flash('error') : [];
  res.locals.formErrors = formErrors;
  res.locals.oldInput = oldInput;
  res.locals.appName = process.env.APP_NAME || 'GYC Sierra Leone';
  res.locals.pageMeta = {
    title: 'GYC Sierra Leone',
    description: 'Youth-led sustainable development organisation in Sierra Leone.',
    keywords: 'GYC Sierra Leone, sustainable development, youth, SDGs, NGO'
  };
  res.locals.theme = {
    programAccents: {
      'Climate Action & Environmental Sustainability': 'sdg-green',
      'SDG Advocacy & Localization': 'sdg-blue',
      'Gender Equality & Women’s Empowerment': 'sdg-red',
      'Youth Employment & Entrepreneurship': 'sdg-orange',
      'Good Governance & Civic Engagement': 'sdg-navy'
    }
  };
  res.locals.branding = {
    name: process.env.APP_NAME || 'GYC Sierra Leone',
    shortName: 'GYC',
    adminName: 'GYC Admin',
    logoPath: '/images/gycsl-logo.svg',
    logoAlt: 'Global Youth Counterpart for Sustainable Development Sierra Leone logo',
    tagline: 'Building an emerging society of young leaders'
  };
  res.locals.currentYear = new Date().getFullYear();
  next();
};
