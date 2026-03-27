const Page = require('../../models/Page');
const Media = require('../../models/Media');

exports.index = async (req, res, next) => {
  try {
    const pages = await Page.all();

    res.render('admin/content/pages', {
      layout: 'layouts/admin',
      title: 'Manage Pages',
      pages
    });
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const [page, mediaItems] = await Promise.all([
      Page.findWithSections(req.params.id),
      Media.all()
    ]);

    if (!page) {
      req.flash('error', 'Page not found.');
      return res.redirect('/admin/pages');
    }

    res.render('admin/content/page-edit', {
      layout: 'layouts/admin',
      title: `Edit ${page.title}`,
      page,
      mediaItems
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Page.updatePage(req.params.id, {
      title: req.body.title,
      hero_title: req.body.hero_title,
      hero_subtitle: req.body.hero_subtitle,
      hero_image_id: req.body.hero_image_id || null,
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0
    });

    req.flash('success', 'Page updated successfully.');
    res.redirect(`/admin/pages/${req.params.id}/edit`);
  } catch (error) {
    next(error);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    await Page.updateSection(req.params.id, {
      title: req.body.title || null,
      subtitle: req.body.subtitle || null,
      body: req.body.body || null,
      image_id: req.body.image_id || null,
      cta_label: req.body.cta_label || null,
      cta_link: req.body.cta_link || null,
      secondary_cta_label: req.body.secondary_cta_label || null,
      secondary_cta_link: req.body.secondary_cta_link || null,
      sort_order: Number(req.body.sort_order || 0),
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0
    });

    req.flash('success', 'Section updated successfully.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    next(error);
  }
};
