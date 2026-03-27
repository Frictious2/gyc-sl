module.exports = (req, res, next) => {
  const formErrors = req.session.formErrors || {};
  const oldInput = req.session.oldInput || {};
  req.session.formErrors = null;
  req.session.oldInput = null;

  res.locals.currentPath = req.path;
  res.locals.adminUser = req.session.adminUser || null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
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
  res.locals.currentYear = new Date().getFullYear();
  next();
};
