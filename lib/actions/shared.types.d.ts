// d.ts file is used to provide TS type info

import { Schema } from 'mongoose';
import { UserInterface } from '@/database/user.model';

export interface CreateAnswerParams {
  content: string;
  author: Schema.Types.ObjectId | UserInterface;
  questionId: string;
  path: string;
}

export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  filter?: string;
}

export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  path: string;
}

export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface SearchParams {
  query?: string | null;
  dbType?: string | null;
}

export interface RecommendedParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

export interface JobFilterParams {
  query: string;
  page: string;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | UserInterface;
  path: string;
}

export interface GetQuestionByIdParams {
  questionId: string;
}

export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  path: string;
}

export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface GetUserByIdParams {
  clerkId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<UserInterface>;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeleteUserParams {
  clerkId: string;
}
