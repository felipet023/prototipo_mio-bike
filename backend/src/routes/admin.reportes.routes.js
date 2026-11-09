const express = require('express');
const controller = require('../controllers/reportes.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/', controller.getReporte);
router.get('/export', controller.exportar);

module.exports = router;