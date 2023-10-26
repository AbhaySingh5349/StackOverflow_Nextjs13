'use server';

import { Answer } from '@/database/answer.model';
import { Question } from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import { CreateAnswerParams } from './shared.types';

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDB();

    const { content, userId, questionId, path } = params;

    const newAnswer = await Answer.create({
      content,
      userId,
      questionId,
    });

    // add answer to questions array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in creating answer: ', err);
    throw new Error(`error in creating answer: ${err}`);
  }
};
