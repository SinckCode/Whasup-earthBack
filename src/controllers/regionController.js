const { Region } = require('../models/sql');

// POST /api/regions - Crear región
async function createRegion(req, res, next) {
  const region = await Region.create({
    userId: req.user.id,
    ...req.body,
  });

  res.status(201).json(region);
}

// GET /api/regions - Listar regiones del usuario
async function getRegions(req, res, next) {
  const regions = await Region.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });

  res.json(regions);
}

// GET /api/regions/:id - Obtener región específica
async function getRegion(req, res, next) {
  const region = await Region.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!region) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  res.json(region);
}

// PUT /api/regions/:id - Actualizar región
async function updateRegion(req, res, next) {
  const region = await Region.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!region) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  await region.update(req.body);
  res.json(region);
}

// DELETE /api/regions/:id - Eliminar región
async function deleteRegion(req, res, next) {
  const result = await Region.destroy({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (result === 0) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  res.json({ message: 'Región eliminada correctamente' });
}

module.exports = {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
};
