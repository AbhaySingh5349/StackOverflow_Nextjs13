import * as z from 'zod';

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title exceeds limit of 100 characters'),
  explanation: z.string().min(20, 'Explanation must be at least 20 characters'),
  tags: z
    .array(
      z
        .string()
        .min(2, 'Tag must be at least 2 characters')
        .max(15, 'Tag exceeds limit of 15 characters')
    )
    .min(1, 'Add at least 1 tag')
    .max(5, 'Maximum 5 tags can be added'),
});

export const AnswerSchema = z.object({
  answer: z.string().min(5, 'Answer needs to be at least 5 characters'),
});
