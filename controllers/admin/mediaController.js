const Media = require('../../models/Media');

exports.upload = async (req, res, next) => {
  try {
    if (!req.files || !req.files.length) {
      req.flash('error', 'Please choose at least one image to upload.');
      return res.redirect('/admin/media');
    }

    for (const file of req.files) {
      await Media.create({
        title: req.body.title || file.originalname,
        file_name: file.filename,
        file_path: `/uploads/${file.filename}`,
        mime_type: file.mimetype,
        alt_text: req.body.alt_text || '',
        file_size: file.size,
        uploaded_by: req.session.adminUser?.id || null
      });
    }

    req.flash('success', `${req.files.length} media file(s) uploaded successfully.`);
    res.redirect('/admin/media');
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Media.delete(req.params.id);
    req.flash('success', 'Media deleted successfully.');
    res.redirect('/admin/media');
  } catch (error) {
    next(error);
  }
};
