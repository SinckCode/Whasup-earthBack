const { z } = require('zod');

const queryEventsSchema = z.object({
  category: z.string().optional(),
  country: z.string().optional(),
  year: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const syncEventsSchema = z.object({
  slug: z.string().min(1),
  year: z.coerce.number().min(2000).max(2100),
});

module.exports = {
  queryEventsSchema,
  syncEventsSchema,
};
