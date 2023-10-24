'use server';

import { Question } from '@/database/question.model';
import { Tag } from '@/database/tag.model';
import { User } from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import { CreateQuestionParams, GetQuestionsParams } from './shared.types';

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectToDB();

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag }) // to get all info about tags (as we stored only ID in questions collection)
      .populate({ path: 'author', model: User }) // to get all info about author (as we stored only ID in questions collection)
      .sort({ createdAt: -1 });

    return { questions };
  } catch (err) {
    console.log('error in fetching questions: ', err);
    throw new Error(`error in fetching questions: ${err}`);
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    await connectToDB();

    const { title, content, tags, author, path } = params;

    // create question
    const question = await Question.create({ title, content, author });

    // create tag or get them if they already exists
    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for user's ask_question action

    // incrememt authors reputation by +5 for creating question

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in creating question: ', err);
    throw new Error(`error in creating question: ${err}`);
  }
};
