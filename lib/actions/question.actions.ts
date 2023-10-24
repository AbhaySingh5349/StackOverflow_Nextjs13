'use server';

import { Question } from '@/database/question.model';
import { Tag } from '@/database/tag.model';
import { connectToDB } from '../mongoose';

export const createQuestion = async (params: any) => {
  try {
    await connectToDB();

    const { title, content, tags, author, redirectPath } = params;

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
  } catch (err) {}
};
