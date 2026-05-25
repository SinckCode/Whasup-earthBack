import { Router } from 'express';
import {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
} from '../controllers/alertController';
import { authRequired } from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { createAlertSchema, updateAlertSchema } from '../schemas/alertSchemas';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

router.post('/', validate(createAlertSchema), createAlert);
router.get('/', getAlerts);
router.get('/:id', getAlert);
router.put('/:id', validate(updateAlertSchema), updateAlert);
router.delete('/:id', deleteAlert);

export default router;
