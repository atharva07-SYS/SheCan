const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  exportCSV,
} = require('../controllers/contactController');
const auth = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact — Public (rate limited)
router.post('/', contactLimiter, createMessage);

// GET /api/contact — Admin only
router.get('/', auth, getMessages);

// GET /api/contact/export/csv — Admin only (must be before /:id)
router.get('/export/csv', auth, exportCSV);

// GET /api/contact/:id — Admin only
router.get('/:id', auth, getMessage);

// PUT /api/contact/:id — Admin only
router.put('/:id', auth, updateMessage);

// DELETE /api/contact/:id — Admin only
router.delete('/:id', auth, deleteMessage);

module.exports = router;
