import { Router } from 'express';
import {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
} from '../controllers/regionController';
import { authRequired } from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { createRegionSchema, updateRegionSchema } from '../schemas/regionSchemas';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

router.post('/', validate(createRegionSchema), createRegion);
router.get('/', getRegions);
router.get('/:id', getRegion);
router.put('/:id', validate(updateRegionSchema), updateRegion);
router.delete('/:id', deleteRegion);

export default router;
