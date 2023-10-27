'use server';

import { ViewQuestionParams } from './shared.types';
import { connectToDB } from '../mongoose';
import { Question } from '@/database/question.model';
import { Interaction } from '@/database/interaction.model';

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDB();

    const { questionId, userId } = params;

    // update view count
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        userId,
        action: 'view',
        questionId,
      });

      if (existingInteraction)
        return console.log('User has already viewed the question');

      // create interaction
      await Interaction.create({ userId, action: 'view', questionId });
    }
  } catch (err) {
    console.log('error in viewing question: ', err);
    throw new Error(`error in viewing question: ${err}`);
  }
};
