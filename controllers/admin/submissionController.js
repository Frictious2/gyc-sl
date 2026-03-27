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
    const activeStatus = type === 'contact' ? (req.query.status || '').trim().toLowerCase() : '';
    const [records, statusCounts] = await Promise.all([
      Submission.list(type, { status: activeStatus }),
      type === 'contact' ? Submission.getContactFilters() : Promise.resolve(null)
    ]);

    res.render('admin/content/submissions', {
      layout: 'layouts/admin',
      title: TITLES[type] || 'Submissions',
      type,
      records,
      activeStatus,
      statusCounts
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const status = (req.body.status || '').trim().toLowerCase();
    if (!['new', 'read', 'replied'].includes(status)) {
      req.flash('error', 'Invalid contact message status.');
      return res.redirect('/admin/submissions/contact');
    }

    await Submission.updateContactStatus(req.params.id, status);
    req.flash('success', 'Contact message status updated.');
    res.redirect(`/admin/submissions/contact${req.query.status ? `?status=${encodeURIComponent(req.query.status)}` : ''}`);
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
