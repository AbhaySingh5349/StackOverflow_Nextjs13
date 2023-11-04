'use server';

import { revalidatePath } from 'next/cache';
import { User } from '@/database/user.model';
import { connectToDB } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  GetUserStatsParams,
  UpdateUserParams,
} from './shared.types';
import { Question } from '@/database/question.model';
import { Error, FilterQuery } from 'mongoose';
import { Answer } from '@/database/answer.model';
import { Tag } from '@/database/tag.model';

import { BadgeCriteriaType } from '@/types/index';
import { assignBadges } from '../utils';

export const getUserById = async (params: GetUserByIdParams) => {
  try {
    await connectToDB();

    const { clerkId } = params;

    const user = User.findOne({ clerkId });

    if (!user) throw new Error('User not found');

    return user;
  } catch (err) {
    console.log('error in retrieving user: ', err);
    throw new Error(`error in retrieving user: ${err}`);
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDB();

    const newUser = User.create(userData);

    return newUser;
  } catch (err) {
    console.log('error in creating user: ', err);
    throw new Error(`error in creating user: ${err}`);
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in updating user: ', err);
    throw new Error(`error in updating user: ${err}`);
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDB();

    const { clerkId } = params;

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deleteUser) throw new Error(`no user found with id: ${clerkId}`);

    // answers & comments of user

    // questions posted by user
    /*  const userQuestionIds = await Question.find({
      author: deletedUser._id,
    }).distinct('_id');
 */
    // delete user questions
    await Question.deleteMany({ author: deletedUser._id });

    return deletedUser;
  } catch (err) {
    console.log('error in deleting user: ', err);
    throw new Error(`error in deleting user: ${err}`);
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectToDB();

    // const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, 'i') } },
        { username: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newUsers':
        sortOptions = { joinedAt: -1 };
        break;
      case 'oldUsers':
        sortOptions = { joinedAt: 1 };
        break;
      case 'topContributors':
        sortOptions = { reputation: -1 };
        break;
      default:
        sortOptions = { joinedAt: -1 };
        break;
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort(sortOptions);

    const usersCount = await User.countDocuments(query);
    const hasNext = usersCount > skip + users.length;

    return { users, hasNext };
  } catch (err) {
    console.log('error in retrieving users: ', err);
    throw new Error(`error in retrieving users: ${err}`);
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    await connectToDB();

    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    if (!user) throw new Error('User not found');

    const questionsCount = await Question.countDocuments({ author: user._id });
    const answersCount = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, totalUpvotes: { $sum: '$upvotes' } } },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, totalUpvotes: { $sum: '$upvotes' } } },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: questionsCount },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: answersCount },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return { user, questionsCount, answersCount, badgeCounts };
  } catch (err) {}
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    await connectToDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const skip = (page - 1) * pageSize;

    const questions = await Question.find({ author: userId })
      .skip(skip)
      .limit(pageSize)
      .sort({
        createdAt: -1,
        views: -1,
        upvotes: -1,
      })
      .populate([
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ]);

    const questionsCount = await Question.countDocuments({ author: userId });

    const hasNext = questionsCount > skip + questions.length;

    return { questions, questionsCount, hasNext };
  } catch (err) {}
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    await connectToDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const skip = (page - 1) * pageSize;

    const answers = await Answer.find({ author: userId })
      .skip(skip)
      .limit(pageSize)
      .sort({
        upvotes: -1,
      })
      .populate([
        { path: 'questionId', model: Question, select: '_id title' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ]);

    const answersCount = await Answer.countDocuments({ author: userId });

    const hasNext = answersCount > skip + answers.length;

    return { answers, answersCount, hasNext };
  } catch (err) {}
};

/*
export const getAllUsers = async (params: GetAllUsersParams) => {
  try{
    await connectToDB();
  }catch(err){
    
  }
}
*/
