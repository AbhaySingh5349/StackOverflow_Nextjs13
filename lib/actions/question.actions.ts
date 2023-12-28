'use server';

import { Question } from '@/database/question.model';
import { Tag } from '@/database/tag.model';
import { User } from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  GetSavedQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
  ToggleSaveQuestionParams,
} from './shared.types';

import { FilterQuery } from 'mongoose';
import { Answer } from '@/database/answer.model';
import { Interaction } from '@/database/interaction.model';

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectToDB();

    const { searchQuery, filter, page = 1, pageSize = 5 } = params;

    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'recommended':
        break;
      case 'frequent':
        sortOptions = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const questions = await Question.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate({ path: 'tags', model: Tag }) // to get all info about tags (as we stored only ID in questions collection)
      .populate({ path: 'author', model: User }) // to get all info about author (as we stored only ID in questions collection)
      .sort(sortOptions);

    const questionsCount = await Question.countDocuments(query);

    const hasNext = questionsCount > skip + questions.length;

    return { questions, hasNext };
  } catch (err) {
    console.log('error in fetching questions: ', err);
    throw new Error(`error in fetching questions: ${err}`);
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    await connectToDB();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      });

    return question;
  } catch (err) {
    console.log('error in fetching question details: ', err);
    throw new Error(`error in fetching question details: ${err}`);
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
    await Interaction.create({
      userId: author,
      action: 'ask_question',
      questionId: question._id,
      tags: tagDocuments,
    });

    // incrememt authors reputation by +5 for creating question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in creating question: ', err);
    throw new Error(`error in creating question: ${err}`);
  }
};

export const upVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDB();

    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // increment users reputation by +1/-1 for upvoting/revoking an upvote to question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -1 : 1 },
    });

    // increment authors reputation by +2/-2 for receiving an upvote/downvote to question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpVoted ? -2 : 2 },
    });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in upVoting question: ', err);
    throw new Error(`error in upVoting question: ${err}`);
  }
};

export const downVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDB();

    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // increment users reputation by +1/-1 for upvoting/revoking an upvote to question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -1 : 1 },
    });

    // increment authors reputation by +2/-2 for receiving an upvote/downvote to question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownVoted ? -2 : 2 },
    });

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in downVoting question: ', err);
    throw new Error(`error in downVoting question: ${err}`);
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    await connectToDB();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('user not found');

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in saving question: ', err);
    throw new Error(`error in saving question: ${err}`);
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    await connectToDB();

    const { clerkId, page = 1, pageSize = 5, filter, searchQuery } = params;

    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case 'mostRecent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'mostVoted':
        sortOptions = { upvotes: -1 };
        break;
      case 'mostViewed':
        sortOptions = { views: -1 };
        break;
      case 'mostAnswered':
        sortOptions = { answers: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: { sort: sortOptions, skip, limit: pageSize + 1 },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!user) throw new Error('user not found');

    const hasNext = user.saved.length > pageSize;

    const savedQuestions = user.saved;

    return { questions: savedQuestions, hasNext };
  } catch (err) {
    console.log('error in retrieving saved questions: ', err);
    throw new Error(`error in retrieving saved questions: ${err}`);
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    await connectToDB();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ questionId });
    await Interaction.deleteMany({ questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
      { new: true }
    );

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in deleting question: ', err);
    throw new Error(`error in deleting question: ${err}`);
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    await connectToDB();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate({
      path: 'tags',
      model: Tag,
    });

    if (!question) throw new Error('Question not found');

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path); // gives new data that was submitted (automatic refresh of path we are redirecting to)
  } catch (err) {
    console.log('error in deleting question: ', err);
    throw new Error(`error in deleting question: ${err}`);
  }
};

export const getTopQuestions = async () => {
  try {
    await connectToDB();

    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return questions;
  } catch (err) {
    console.log('error in retrieving top 5 questions: ', err);
    throw new Error(`error in retrieving top 5 questions: ${err}`);
  }
};

export const getRecommendedQuestions = async (params: RecommendedParams) => {
  try {
    await connectToDB();

    const { clerkId, page = 1, pageSize = 5, searchQuery } = params;

    const user = await User.findOne({ clerkId });

    if (!user) throw new Error('user not found');

    const skip = (page - 1) * pageSize;

    // user's interaction
    const userInteractions = await Interaction.find({ userId: user._id })
      .populate('tags')
      .exec();

    // extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) tags = tags.concat(interaction.tags);
      return tags;
    }, []);

    // get distinct Tag ID's from users interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // questions with users tags
        { author: { $ne: user._id } }, // exclude users own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const questionsCount = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate([
        { path: 'tags', model: Tag },
        { path: 'author', model: User },
      ]);

    console.log('questionsCount: ', questionsCount, ' , skip: ', skip);

    const hasNext = questionsCount > skip + recommendedQuestions.length;

    return { questions: recommendedQuestions, hasNext };
  } catch (err) {
    console.log('error in retrieving recommended questions: ', err);
    throw new Error(`error in retrieving recommended questions: ${err}`);
  }
};
