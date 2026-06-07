const express = require('express');
const router = express.Router();
const {
  getStats,
  getChartData,
  getActivityLogs,
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// GET /api/analytics/stats — Admin only
router.get('/stats', auth, getStats);

// GET /api/analytics/chart — Admin only
router.get('/chart', auth, getChartData);

// GET /api/analytics/logs — Admin only
router.get('/logs', auth, getActivityLogs);

module.exports = router;
