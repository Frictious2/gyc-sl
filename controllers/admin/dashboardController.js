const Dashboard = require('../../models/Dashboard');

exports.index = async (req, res, next) => {
  try {
    const summary = await Dashboard.getSummary();

    res.render('admin/dashboard/index', {
      layout: 'layouts/admin',
      title: 'Dashboard',
      summary
    });
  } catch (error) {
    next(error);
  }
};
