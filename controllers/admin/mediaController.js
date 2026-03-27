const Media = require('../../models/Media');

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please choose an image to upload.');
      return res.redirect('/admin/media');
    }

    await Media.create({
      title: req.body.title || req.file.originalname,
      file_name: req.file.filename,
      file_path: `/uploads/${req.file.filename}`,
      mime_type: req.file.mimetype,
      alt_text: req.body.alt_text || '',
      file_size: req.file.size,
      uploaded_by: req.session.adminUser?.id || null
    });

    req.flash('success', 'Media uploaded successfully.');
    res.redirect('/admin/media');
  } catch (error) {
    next(error);
  }
};
