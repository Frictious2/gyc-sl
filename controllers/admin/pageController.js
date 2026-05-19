const Page = require('../../models/Page');
const Media = require('../../models/Media');

function toNullableId(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizePage(page) {
  return {
    ...page,
    sections: Array.isArray(page?.sections) ? page.sections : []
  };
}

function logPageEditorError(stage, error, req) {
  console.error(`[admin/pageController] ${stage}`, {
    pageId: req.params.id || req.body.page_id || null,
    sectionId: req.body.section_id || null,
    route: req.originalUrl,
    method: req.method,
    message: error.message,
    code: error.code,
    sqlMessage: error.sqlMessage,
    stack: error.stack
  });
}

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
      page: normalizePage(page),
      mediaItems: Array.isArray(mediaItems) ? mediaItems : []
    });
  } catch (error) {
    logPageEditorError('edit', error, req);
    req.flash('error', 'We could not load that page editor. Please check that the production database has the latest CMS page schema.');
    res.redirect('/admin/pages');
  }
};

exports.update = async (req, res, next) => {
  try {
    const pageIdentity = await Page.getPageIdentity(req.params.id);
    const isHomePage =
      String(pageIdentity?.slug || '').toLowerCase() === 'home' ||
      String(pageIdentity?.route_path || '') === '/' ||
      String(pageIdentity?.page_type || '').toLowerCase() === 'home';
    const updatePayload = {
      title: req.body.title || '',
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0
    };

    if (!isHomePage) {
      updatePayload.hero_title = req.body.hero_title || null;
      updatePayload.hero_subtitle = req.body.hero_subtitle || null;
      updatePayload.hero_image_id = toNullableId(req.body.hero_image_id);
    }

    await Page.updatePage(req.params.id, updatePayload);

    req.flash('success', 'Page updated successfully.');
    res.redirect(`/admin/pages/${req.params.id}/edit`);
  } catch (error) {
    logPageEditorError('update', error, req);
    req.flash('error', 'We could not save that page. Please review the page fields and the page schema on production.');
    res.redirect(`/admin/pages/${req.params.id}/edit`);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    await Page.updateSection(req.params.id, {
      title: req.body.title || null,
      subtitle: req.body.subtitle || null,
      body: req.body.body || null,
      image_id: toNullableId(req.body.image_id),
      cta_label: req.body.cta_label || null,
      cta_link: req.body.cta_link || null,
      secondary_cta_label: req.body.secondary_cta_label || null,
      secondary_cta_link: req.body.secondary_cta_link || null,
      sort_order: toInteger(req.body.sort_order, 0),
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0
    });

    req.flash('success', 'Section updated successfully.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('updateSection', error, req);
    req.flash('error', 'We could not save that section. Missing media records or an outdated schema may be causing the failure.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};

exports.createSectionItem = async (req, res, next) => {
  try {
    await Page.createSectionItem({
      section_id: toInteger(req.body.section_id, 0),
      item_type: req.body.item_type || 'card',
      title: req.body.title || null,
      subtitle: req.body.subtitle || null,
      body: req.body.body || null,
      meta_json: req.body.meta_json || null,
      image_id: toNullableId(req.body.image_id),
      link_label: req.body.link_label || null,
      link_url: req.body.link_url || null,
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0,
      sort_order: toInteger(req.body.sort_order, 0)
    });

    req.flash('success', 'Section item added successfully.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('createSectionItem', error, req);
    req.flash('error', 'We could not add that section item. Please check the section data and try again.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};

exports.updateSectionItem = async (req, res, next) => {
  try {
    await Page.updateSectionItem(req.params.id, {
      item_type: req.body.item_type || 'card',
      title: req.body.title || null,
      subtitle: req.body.subtitle || null,
      body: req.body.body || null,
      meta_json: req.body.meta_json || null,
      image_id: toNullableId(req.body.image_id),
      link_label: req.body.link_label || null,
      link_url: req.body.link_url || null,
      status: req.body.status || 'published',
      is_published: req.body.is_published ? 1 : 0,
      sort_order: toInteger(req.body.sort_order, 0)
    });

    req.flash('success', 'Section item updated successfully.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('updateSectionItem', error, req);
    req.flash('error', 'We could not update that section item. Please verify the values and try again.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};

exports.deleteSectionItem = async (req, res, next) => {
  try {
    await Page.deleteSectionItem(req.params.id);
    req.flash('success', 'Section item deleted.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('deleteSectionItem', error, req);
    req.flash('error', 'We could not delete that section item.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};

exports.createSectionMedia = async (req, res, next) => {
  try {
    if (!toNullableId(req.body.media_id)) {
      req.flash('error', 'Please select a media asset before linking section media.');
      return res.redirect(`/admin/pages/${req.body.page_id}/edit`);
    }

    await Page.createSectionMedia({
      section_id: toInteger(req.body.section_id, 0),
      media_id: toNullableId(req.body.media_id),
      media_role: req.body.media_role || 'gallery',
      caption: req.body.caption || null,
      alt_text: req.body.alt_text || null,
      sort_order: toInteger(req.body.sort_order, 0)
    });

    req.flash('success', 'Section media linked successfully.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('createSectionMedia', error, req);
    req.flash('error', 'We could not link that media asset. The selected media may be missing, deleted, or the production schema may be outdated.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};

exports.deleteSectionMedia = async (req, res, next) => {
  try {
    await Page.deleteSectionMedia(req.params.id);
    req.flash('success', 'Section media removed.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  } catch (error) {
    logPageEditorError('deleteSectionMedia', error, req);
    req.flash('error', 'We could not remove that section media link.');
    res.redirect(`/admin/pages/${req.body.page_id}/edit`);
  }
};
