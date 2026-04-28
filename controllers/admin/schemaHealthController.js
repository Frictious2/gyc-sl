const SchemaHealth = require('../../models/SchemaHealth');

exports.index = async (req, res, next) => {
  try {
    const report = await SchemaHealth.getReport();

    res.render('admin/system/schema-health', {
      layout: 'layouts/admin',
      title: 'Schema Health Check',
      report
    });
  } catch (error) {
    console.error('[admin/schemaHealthController] index', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    next(error);
  }
};
