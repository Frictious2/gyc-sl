const Submission = require('../../models/Submission');

const TITLES = {
  contact: 'Contact Messages',
  volunteer: 'Volunteer Applications',
  partnership: 'Partnership Inquiries',
  newsletter: 'Newsletter Subscribers'
};

exports.index = async (req, res, next) => {
  try {
    const type = req.params.type;
    const records = await Submission.list(type);
    res.render('admin/content/submissions', {
      layout: 'layouts/admin',
      title: TITLES[type] || 'Submissions',
      type,
      records
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Submission.delete(req.params.type, req.params.id);
    req.flash('success', 'Submission deleted successfully.');
    res.redirect(`/admin/submissions/${req.params.type}`);
  } catch (error) {
    next(error);
  }
};
