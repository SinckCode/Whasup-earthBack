import { z } from 'zod';

const updateNotificationSchema = z.object({
  isRead: z.boolean(),
});

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

export {
  updateNotificationSchema,
};
