import { z } from 'zod';

const createCommentSchema = z.object({
  eventId: z.string().min(1),
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
});

const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

export {
  createCommentSchema,
  updateCommentSchema,
};
