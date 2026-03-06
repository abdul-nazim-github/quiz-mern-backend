/**
 * Question Model
 *
 * Represents an individual question within a quiz topic.
 */

import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Interface representing the Question Document in MongoDB
 */
export interface IQuestion extends Document {
  title: string;
  topic: Types.ObjectId; // Parent relationship to Topic
  type: 'input' | 'textarea' | 'radio' | 'checkbox'; // Question input type
  required: boolean;
  options?: string[];    // Array of choices (for radio/checkbox).
  answer?: string[];     // Array of correct answers.
  status: boolean;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    type: {
      type: String,
      enum: ['input', 'textarea', 'radio', 'checkbox'],
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
    /**
     * Options Field
     *
     * In MongoDB (MERN), we use a typed array of Strings.
     */
    options: {
      type: [String],
      default: null,
    },
    /**
     * Answer Field
     *
     * Stores the correct answers. For 'checkbox', this can hold multiple values.
     */
    answer: {
      type: [String],
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
