const express = require('express');
const authController = require('../controllers/admin/authController');
const dashboardController = require('../controllers/admin/dashboardController');
const contentController = require('../controllers/admin/contentController');
const pageController = require('../controllers/admin/pageController');
const settingsController = require('../controllers/admin/settingsController');
const mediaController = require('../controllers/admin/mediaController');
const { requireAuth, requireGuest } = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);
router.post('/logout', requireAuth, authController.logout);

router.get('/', requireAuth, dashboardController.index);
router.get('/content', requireAuth, contentController.index);
router.get('/pages', requireAuth, pageController.index);
router.get('/pages/:id/edit', requireAuth, pageController.edit);
router.post('/pages/:id', requireAuth, pageController.update);
router.post('/sections/:id', requireAuth, pageController.updateSection);
router.get('/contact-block', requireAuth, settingsController.contactBlock);
router.post('/contact-block', requireAuth, settingsController.updateContactBlock);
router.get('/seo', requireAuth, settingsController.seo);
router.get('/media', requireAuth, settingsController.media);
router.post('/media', requireAuth, upload.single('image'), mediaController.upload);

module.exports = router;
