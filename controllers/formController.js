const { validationResult } = require('express-validator');
const Submission = require('../models/Submission');

function handleValidation(req, res, redirectPath) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.formErrors = errors.mapped();
    req.session.oldInput = { ...req.body };
    req.flash('error', 'Please correct the highlighted fields and try again.');
    res.redirect(redirectPath);
    return false;
  }

  return true;
}

exports.contact = async (req, res, next) => {
  try {
    if (!handleValidation(req, res, '/contact')) {
      return;
    }

    await Submission.create('contact', {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone || null,
      subject: req.body.subject || null,
      message: req.body.message
    });

    req.flash('success', 'Your message has been sent successfully.');
    req.session.oldInput = null;
    res.redirect('/contact');
  } catch (error) {
    next(error);
  }
};

exports.volunteer = async (req, res, next) => {
  try {
    if (!handleValidation(req, res, '/get-involved/volunteer')) {
      return;
    }

    await Submission.create('volunteer', {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone || null,
      district: req.body.district || null,
      interests: req.body.interests || null,
      motivation: req.body.motivation || null
    });

    req.flash('success', 'Volunteer application submitted successfully.');
    req.session.oldInput = null;
    res.redirect('/get-involved/volunteer');
  } catch (error) {
    next(error);
  }
};

exports.partner = async (req, res, next) => {
  try {
    if (!handleValidation(req, res, '/get-involved/partner')) {
      return;
    }

    await Submission.create('partnership', {
      organisation_name: req.body.organisation_name,
      contact_name: req.body.contact_name,
      email: req.body.email,
      phone: req.body.phone || null,
      partnership_type: req.body.partnership_type || null,
      message: req.body.message || null
    });

    req.flash('success', 'Partnership inquiry submitted successfully.');
    req.session.oldInput = null;
    res.redirect('/get-involved/partner');
  } catch (error) {
    next(error);
  }
};

exports.newsletter = async (req, res, next) => {
  try {
    if (!handleValidation(req, res, '/news')) {
      return;
    }

    await Submission.create('newsletter', {
      email: req.body.email,
      source: 'website-newsletter'
    });

    req.flash('success', 'You have been subscribed to the newsletter.');
    req.session.oldInput = null;
    res.redirect('/news');
  } catch (error) {
    next(error);
  }
};
