'use server';

import { connectToDB } from '../mongoose';

export const createQuestion = async (params: any) => {
  try {
    await connectToDB();
  } catch (err) {}
};
