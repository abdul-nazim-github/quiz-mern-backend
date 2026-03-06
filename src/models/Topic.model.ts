/**
 * Topic Model
 *
 * Represents a category for questions (e.g., 'PHP', 'JavaScript', 'General Knowledge').
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing the Topic Document in MongoDB
 */
export interface ITopic extends Document {
  name: string;
  status: boolean; // Active/Inactive toggle
}

const TopicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: true,
      unique: true,   // Ensures each topic name is unique globally
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Virtual Relationship: hasMany(Questions)
 *
 * This tells Mongoose that 'questions' can be retrieved by looking for
 * Questions where question.topic matches this topic._id.
 */
TopicSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'topic',
});

// Settings to ensure virtual fields (like 'questions') appear when using JSON.stringify or res.json()
TopicSchema.set('toJSON', { virtuals: true });
TopicSchema.set('toObject', { virtuals: true });

export default mongoose.model<ITopic>('Topic', TopicSchema);
