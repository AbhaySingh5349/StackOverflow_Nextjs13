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

export const EditProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name exceeds limit of 50 characters'),
  username: z
    .string()
    .min(2, 'UserName must be at least 2 characters')
    .max(50, 'UserName exceeds limit of 50 characters'),
  portfolioWebsite: z.string().url(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(50, 'Location exceeds limit of 50 characters'),
  bio: z
    .string()
    .min(20, 'Bio must be at least 20 characters')
    .max(100, 'Bio exceeds limit of 100 characters'),
});
