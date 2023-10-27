'use server';

import { Tag, TagInterface } from '@/database/tag.model';
import { User } from '@/database/user.model';
import { connectToDB } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types';
import { FilterQuery } from 'mongoose';
import { Question } from '@/database/question.model';

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDB();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error(`User not found with id: ${userId}`);

    // find interactions for user & group by tags

    return [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
      { _id: '3', name: 'tag3' },
    ];
  } catch (err) {}
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDB();

    const tags = await Tag.find({});

    return { tags };
  } catch (err) {
    console.log('error in retrieving tags: ', err);
    throw new Error(`error in retrieving tags: ${err}`);
  }
};

export const getQuestionByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    await connectToDB();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // const query: FilterQuery<TagInterface> = {_id: tagId}

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    const tag = await Tag.findById(tagId).populate({
      path: 'questions',
      model: Question,
      match: query,
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!tag) throw new Error('tag not found');

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (err) {
    console.log('error in retrieving questions for tag id: ', err);
    throw new Error(`error in retrieving questions for tag id: ${err}`);
  }
};
