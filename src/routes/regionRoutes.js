const express = require('express');
const {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
} = require('../controllers/regionController');
const { authRequired } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createRegionSchema, updateRegionSchema } = require('../schemas/regionSchemas');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

router.post('/', validate(createRegionSchema), createRegion);
router.get('/', getRegions);
router.get('/:id', getRegion);
router.put('/:id', validate(updateRegionSchema), updateRegion);
router.delete('/:id', deleteRegion);

module.exports = router;
