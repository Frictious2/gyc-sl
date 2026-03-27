const Setting = require('../../models/Setting');
const Media = require('../../models/Media');
const seedData = require('../../scripts/seed-data');

exports.contactBlock = async (req, res, next) => {
  try {
    const settings = await Setting.byGroup('contact');

    res.render('admin/content/contact-block', {
      layout: 'layouts/admin',
      title: 'Contact & Map Block',
      settings,
      fallback: seedData.contactSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContactBlock = async (req, res, next) => {
  try {
    const entries = Object.entries(req.body);

    for (const [key, value] of entries) {
      await Setting.save(key, value, 'contact');
    }

    req.flash('success', 'Contact block updated successfully.');
    res.redirect('/admin/contact-block');
  } catch (error) {
    next(error);
  }
};

exports.seo = (req, res) => {
  res.render('admin/content/seo', {
    layout: 'layouts/admin',
    title: 'SEO Fields',
    seoEntries: seedData.seo
  });
};

exports.media = async (req, res, next) => {
  try {
    const mediaItems = await Media.all();

    res.render('admin/content/media', {
      layout: 'layouts/admin',
      title: 'Media Library',
      mediaItems
    });
  } catch (error) {
    next(error);
  }
};
