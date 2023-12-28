'use server';

import { Answer } from '@/database/answer.model';
import { Question } from '@/database/question.model';
import { User } from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from './shared.types';
import { Interaction } from '@/database/interaction.model';

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDB();

    const { content, author, questionId, path } = params;

    const answer = await Answer.create({
      content,
      author,
      questionId,
    });

    // add answer to questions array
    const question = await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    // create an interaction record for user's answer action
    await Interaction.create({
      userId: author,
      action: 'answer',
      questionId: answer._id,
      tags: question.tags,
    });

    // incrememt authors reputation by +5 for creating answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in creating answer: ', err);
    throw new Error(`error in creating answer: ${err}`);
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    await connectToDB();

    const { questionId, page = 1, pageSize = 5, filter } = params;

    const skip = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const answers = await Answer.find({ questionId })
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      })
      .sort(sortOptions);

    const answersCount = await Answer.countDocuments({ questionId });

    const hasNext = answersCount > skip + answers.length;

    /* 
    {
    _id: string;
    author: {
        _id: string;
        clerkId: string;
        name: string;
        picture: string;
    };
    content: string;
    upvotes: Object[];
    downvotes: Object[];
    createdAt: Date;
}
*/

    return { answers, hasNext };
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

    // increment users reputation by +1/-1 for upvoting/revoking an upvote to answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -1 : 1 },
    });

    // increment authors reputation by +2/-2 for receiving an upvote/downvote to answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpVoted ? -2 : 2 },
    });

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

    // increment users reputation by +1/-1 for upvoting/revoking a downvote to answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -1 : 1 },
    });

    // increment authors reputation by +2/-2 for receiving an downvote to answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownVoted ? -2 : 2 },
    });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in downVoting answer: ', err);
    throw new Error(`error in downVoting answer: ${err}`);
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    await connectToDB();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) throw new Error('Answer not found');

    await Answer.deleteOne({ _id: answerId });
    await Question.updateOne(
      { _id: answer.questionId },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answerId });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in deleting question: ', err);
    throw new Error(`error in deleting question: ${err}`);
  }
};
