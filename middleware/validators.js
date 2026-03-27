const { body } = require('express-validator');

exports.contactRules = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Full name must be between 2 and 180 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('Phone number must be 80 characters or fewer.'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 180 })
    .withMessage('Subject must be between 3 and 180 characters.'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters.')
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
