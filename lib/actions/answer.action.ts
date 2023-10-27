'use server';

import { Answer } from '@/database/answer.model';
import { Question } from '@/database/question.model';
import { User } from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from './shared.types';

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDB();

    const { content, author, questionId, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
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

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    await connectToDB();

    const { questionId } = params;

    const answers = await Answer.find({ questionId })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      })
      .sort({ createdAt: -1 });

    return answers;
  } catch (err) {
    console.log('error in retrieving answer: ', err);
    throw new Error(`error in retrieving answer: ${err}`);
  }
};

export const upVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDB();

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};
    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } }; // pull upvotes which has current user id
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      }; // pull userId from downvotes & push it to upvotes
    } else {
      updateQuery = { $addToSet: { upvotes: userId } }; // add new upvote of userId to set
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // increment authors reputation
    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in upVoting answer: ', err);
    throw new Error(`error in upVoting answer: ${err}`);
  }
};

export const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDB();

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};
    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } }; // pull upvotes which has current user id
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      }; // pull userId from downvotes & push it to upvotes
    } else {
      updateQuery = { $addToSet: { downvotes: userId } }; // add new upvote of userId to set
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // increment authors reputation
    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in downVoting answer: ', err);
    throw new Error(`error in downVoting answer: ${err}`);
  }
};
