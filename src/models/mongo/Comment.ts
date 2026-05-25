import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ eventId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
