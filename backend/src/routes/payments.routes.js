const express = require('express');
const controller = require('../controllers/payments.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/simulate', authenticate, controller.simulate);

module.exports = router;