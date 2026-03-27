const ContentModule = require('../../models/ContentModule');
const Media = require('../../models/Media');

function normalizeBoolean(value) {
  return value ? 1 : 0;
}

function normalizeValue(value) {
  return value === '' ? null : value;
}

function buildPayload(moduleKey, body) {
  const config = ContentModule.getConfig(moduleKey);
  const payload = {};

  config.fields.forEach((field) => {
    if (field === 'is_featured' || field === 'is_published') {
      payload[field] = normalizeBoolean(body[field]);
      return;
    }

    if (field === 'sort_order') {
      payload[field] = Number(body[field] || 0);
      return;
    }

    payload[field] = normalizeValue(body[field]);
  });

  return payload;
}

async function loadRelatedOptions() {
  const [programs, projects] = await Promise.all([
    ContentModule.list('programs'),
    ContentModule.list('projects')
  ]);

  return { programs, projects };
}

exports.index = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    const records = await ContentModule.list(req.params.module);
    res.render('admin/content/module-list', {
      layout: 'layouts/admin',
      title: `Manage ${config.table.replace(/_/g, ' ')}`,
      moduleKey: req.params.module,
      config,
      records
    });
  } catch (error) {
    next(error);
  }
};

exports.createForm = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    const [mediaItems, relatedOptions] = await Promise.all([
      Media.all(),
      loadRelatedOptions()
    ]);
    res.render('admin/content/module-edit', {
      layout: 'layouts/admin',
      title: `Create ${config.singular}`,
      moduleKey: req.params.module,
      config,
      record: {},
      mediaItems,
      relatedOptions,
      mode: 'create'
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    await ContentModule.create(req.params.module, buildPayload(req.params.module, req.body));
    req.flash('success', `${config.singular} created successfully.`);
    res.redirect(`/admin/modules/${req.params.module}`);
  } catch (error) {
    next(error);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    const [record, mediaItems, relatedOptions] = await Promise.all([
      ContentModule.find(req.params.module, req.params.id),
      Media.all(),
      loadRelatedOptions()
    ]);

    if (!record) {
      req.flash('error', `${config.singular} not found.`);
      return res.redirect(`/admin/modules/${req.params.module}`);
    }

    res.render('admin/content/module-edit', {
      layout: 'layouts/admin',
      title: `Edit ${record[config.titleField] || config.singular}`,
      moduleKey: req.params.module,
      config,
      record,
      mediaItems,
      relatedOptions,
      mode: 'edit'
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    await ContentModule.update(req.params.module, req.params.id, buildPayload(req.params.module, req.body));
    req.flash('success', `${config.singular} updated successfully.`);
    res.redirect(`/admin/modules/${req.params.module}/${req.params.id}/edit`);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const config = ContentModule.getConfig(req.params.module);
    if (!config) {
      req.flash('error', 'Unknown content module.');
      return res.redirect('/admin/content');
    }

    await ContentModule.softDelete(req.params.module, req.params.id);
    req.flash('success', `${config.singular} deleted successfully.`);
    res.redirect(`/admin/modules/${req.params.module}`);
  } catch (error) {
    next(error);
  }
};
