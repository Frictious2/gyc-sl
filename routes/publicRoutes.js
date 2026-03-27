const express = require('express');
const publicController = require('../controllers/publicController');
const formController = require('../controllers/formController');

const router = express.Router();

router.get('/', publicController.home);
router.get('/about', publicController.standardPage);
router.get('/about/our-story', publicController.standardPage);
router.get('/about/vision-mission', publicController.standardPage);
router.get('/about/team', publicController.teamPage);
router.get('/about/partners', publicController.partnersPage);
router.get('/programs', publicController.programsOverview);
router.get('/programs/:slug', publicController.programDetail);
router.get('/get-involved', publicController.standardPage);
router.get('/get-involved/volunteer', publicController.standardPage);
router.get('/get-involved/partner', publicController.standardPage);
router.get('/donate', publicController.standardPage);
router.get('/projects', publicController.projectsListing);
router.get('/projects/:slug', publicController.projectDetail);
router.get('/news', publicController.newsListing);
router.get('/news/:slug', publicController.newsDetail);
router.get('/resources', publicController.resourcesPage);
router.get('/gallery', publicController.galleryPage);
router.get('/contact', publicController.contactPage);

router.post('/contact', formController.contact);
router.post('/volunteer-application', formController.volunteer);
router.post('/partnership-inquiry', formController.partner);
router.post('/newsletter-subscribe', formController.newsletter);

module.exports = router;
