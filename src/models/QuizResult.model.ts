/**
 * QuizResult Model
 *
 * Stores the submission details for a completed quiz.
 * This model tracks which user took which topic and what their answers were.
 */

import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Interface for an individual question answer in the submission.
 * Each object maps a Question ID to the User's choice.
 */
interface IQuestionAnswer {
  id: string;        // The _id of the Question
  answer: string | string[]; // Can be a string (radio/input) or array (checkbox)
}

/**
 * Interface representing the QuizResult Document in MongoDB
 */
export interface IQuizResult extends Document {
  user: Types.ObjectId;
  topic: Types.ObjectId;
  question_answer: IQuestionAnswer[]; // Array of nested objects
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    /**
     * Question Answer Array
     *
     * Stores the user's responses as a list of sub-documents.
     * Schema.Types.Mixed is used for 'answer' to allow both Strings and Arrays.
     */
    question_answer: {
      type: [
        {
          id: { type: String, required: true },
          answer: { type: Schema.Types.Mixed }, // Mixed allows flexible data types
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true // Tracks when the quiz was submitted
  }
);

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
