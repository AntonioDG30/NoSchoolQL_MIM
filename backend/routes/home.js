const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/home.controller');

// GET /api/home/stats
router.get('/stats', HomeController.getHomepageStats);

module.exports = router;
