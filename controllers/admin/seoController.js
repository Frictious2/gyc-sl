const SeoMeta = require('../../models/SeoMeta');
const Media = require('../../models/Media');

exports.index = async (req, res, next) => {
  try {
    const entries = await SeoMeta.list();
    res.render('admin/content/seo-list', {
      layout: 'layouts/admin',
      title: 'SEO Fields',
      entries
    });
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const [entry, mediaItems] = await Promise.all([
      SeoMeta.find(req.params.id),
      Media.all()
    ]);

    if (!entry) {
      req.flash('error', 'SEO entry not found.');
      return res.redirect('/admin/seo');
    }

    res.render('admin/content/seo-edit', {
      layout: 'layouts/admin',
      title: `Edit SEO for ${entry.route_path}`,
      entry,
      mediaItems
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    await SeoMeta.update(req.params.id, {
      route_path: req.body.route_path,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      og_title: req.body.og_title || null,
      og_description: req.body.og_description || null,
      og_image_id: req.body.og_image_id || null,
      canonical_url: req.body.canonical_url || null
    });

    req.flash('success', 'SEO entry updated successfully.');
    res.redirect(`/admin/seo/${req.params.id}/edit`);
  } catch (error) {
    next(error);
  }
};
