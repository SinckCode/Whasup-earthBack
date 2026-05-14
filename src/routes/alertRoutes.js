const express = require('express');
const {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { authRequired } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createAlertSchema, updateAlertSchema } = require('../schemas/alertSchemas');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

router.post('/', validate(createAlertSchema), createAlert);
router.get('/', getAlerts);
router.get('/:id', getAlert);
router.put('/:id', validate(updateAlertSchema), updateAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
