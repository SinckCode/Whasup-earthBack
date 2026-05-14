const Event = require('../models/mongo/Event');

// GET /api/events - Listar eventos cacheados
async function getEvents(req, res, next) {
  const { category, country, year, page = 1, limit = 20 } = req.query;

  const query = {};
  if (category) query.category = category;
  if (country) query.country = country;
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.startDate = { $gte: startDate, $lte: endDate };
  }

  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    Event.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Event.countDocuments(query),
  ]);

  res.json({
    data: events,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

// GET /api/events/:id - Obtener evento específico
async function getEvent(req, res, next) {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }

  res.json(event);
}

// POST /api/events/sync/:slug/:year - Sincronizar eventos de EONET (admin)
async function syncEvents(req, res, next) {
  // Validar que sea admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo admins pueden sincronizar eventos' });
  }

  const { slug, year } = req.params;

  try {
    // TODO: Llamar a EONET API y guardar en MongoDB
    // Por ahora, respuesta placeholder
    res.json({
      message: `Sincronización de ${slug} para ${year} iniciada`,
      status: 'pending',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents,
  getEvent,
  syncEvents,
};
