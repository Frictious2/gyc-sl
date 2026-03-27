const { body } = require('express-validator');

exports.contactRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('A valid email address is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.')
];

exports.volunteerRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('A valid email address is required.')
];

exports.partnershipRules = [
  body('organisation_name').trim().notEmpty().withMessage('Organisation name is required.'),
  body('contact_name').trim().notEmpty().withMessage('Contact name is required.'),
  body('email').trim().isEmail().withMessage('A valid email address is required.')
];

exports.newsletterRules = [
  body('email').trim().isEmail().withMessage('A valid email address is required.')
];
