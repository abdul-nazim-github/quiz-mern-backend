/**
 * Task Model
 *
 * Represents a user-specific task with an address and completion status.
 */

import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Interface representing the Task Document in MongoDB
 */
export interface ITask extends Document {
  title: string;
  description?: string;
  status: boolean;
  address: string;      // Auto-filled in controller via IP info service
  user: Types.ObjectId; // Reference to the User who owns this task
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Compound Unique Index
 *
 * Ensures that a user cannot have two tasks with the exact same title.
 * strength: 2 makes the unique constraint case-insensitive (e.g., 'Work' == 'work').
 */
TaskSchema.index(
  { user: 1, title: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);
