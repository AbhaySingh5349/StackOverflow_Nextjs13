'use server';

import { User } from '@/database/user.model';
import { connectToDB } from '../mongoose';

export const getUserById = async (params: any) => {
  try {
    await connectToDB();

    const { userId } = params;

    const user = User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.log('error in retrieving user: ', err);
    throw new Error(`error in retrieving user: ${err}`);
  }
};
