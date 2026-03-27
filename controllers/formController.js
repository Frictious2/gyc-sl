const { validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const mailService = require('../services/mailService');

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

    const payload = {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone || null,
      subject: req.body.subject || null,
      message: req.body.message
    };

    const normalizedFingerprint = `${payload.email}|${payload.subject || ''}|${payload.message}`.trim().toLowerCase();

    const duplicateWindowMs = 10 * 60 * 1000;
    const lastSubmittedAt = Number(req.session.lastContactSubmittedAt || 0);
    const isSameRecentSubmission =
      req.session.lastContactFingerprint === normalizedFingerprint &&
      lastSubmittedAt &&
      Date.now() - lastSubmittedAt < duplicateWindowMs;

    if (isSameRecentSubmission) {
      req.flash('error', 'This message was already submitted. Please wait before sending it again.');
      req.session.oldInput = { ...req.body };
      return res.redirect('/contact');
    }

    const duplicateMessages = await Submission.findRecentDuplicateContact(payload);
    if (duplicateMessages.length) {
      req.flash('error', 'A very similar message was sent recently. Please wait for a reply before sending it again.');
      req.session.oldInput = { ...req.body };
      return res.redirect('/contact');
    }

    await Submission.create('contact', payload);
    req.session.lastContactFingerprint = normalizedFingerprint;
    req.session.lastContactSubmittedAt = Date.now();

    Promise.allSettled([
      mailService.sendContactNotification(payload),
      mailService.sendContactAutoReply(payload)
    ]).then((results) => {
      results
        .filter((result) => result.status === 'rejected')
        .forEach((result) => {
          console.error('Contact email delivery failed:', result.reason);
        });
    });

    req.flash('success', 'Your message has been sent successfully. We have received your message and will get back to you.');
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
