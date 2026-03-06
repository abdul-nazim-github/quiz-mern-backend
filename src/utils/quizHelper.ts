/**
 * Quiz Helper Utilities
 *
 * Contains logic for comparing user answers with correct answers.
 */

/**
 * Compare Answers
 *
 * Works for:
 * - Single Strings (Input/Radio)
 * - Arrays of Strings (Checkbox)
 *
 * Logic:
 * - If both are arrays: Sorts both and compares JSON strings to ensure order doesn't fail the match.
 * - If correct is array with 1 item: Compares that item with user answer string.
 * - Otherwise: Direct equality check.
 */
export const compareAnswers = (
  correctAnswer: string | string[] | null | undefined,
  userAnswer: string | string[] | null | undefined
): boolean => {
  if (!correctAnswer || !userAnswer) return false;

  // Comparison logic for Checkboxes (Arrays)
  if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
    if (correctAnswer.length !== userAnswer.length) return false;
    const sortedCorrect = [...correctAnswer].sort();
    const sortedUser = [...userAnswer].sort();
    return JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
  }

  // Handle single-answer questions stored as an array in DB
  if (Array.isArray(correctAnswer) && correctAnswer.length === 1 && !Array.isArray(userAnswer)) {
    return correctAnswer[0] === userAnswer;
  }

  // Fallback for single strings
  return correctAnswer === userAnswer;
};
