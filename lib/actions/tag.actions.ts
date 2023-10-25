'use server';

import { Tag } from '@/database/tag.model';
import { User } from '@/database/user.model';
import { connectToDB } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types';

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
