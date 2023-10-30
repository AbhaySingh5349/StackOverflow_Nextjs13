'use server';

import { SearchParams } from './shared.types';
import { connectToDB } from '../mongoose';
import { Question } from '@/database/question.model';
import { User } from '@/database/user.model';
import { Answer } from '@/database/answer.model';
import { Tag } from '@/database/tag.model';

const SearchableDbTypes = ['question', 'user', 'answer', 'tag'];

export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDB();

    const { query, dbType } = params;
    const regexQuery = { $regex: query, $options: 'i' };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: 'title', dbType: 'question' },
      { model: User, searchField: 'name', dbType: 'user' },
      { model: Answer, searchField: 'content', dbType: 'answer' },
      { model: Tag, searchField: 'name', dbType: 'tag' },
    ];

    const dbTypeLower = dbType?.toLowerCase();

    if (!dbTypeLower || !SearchableDbTypes.includes(dbTypeLower)) {
      // search across everything
      for (const { model, searchField, dbType } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2); // 2 values from each db

        results.push(
          ...queryResults.map((item) => ({
            title:
              dbType === 'answer'
                ? `Answers containing ${query}`
                : item[searchField],
            dbType,
            id:
              dbType === 'user'
                ? item.clerkId
                : dbType === 'answer'
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      // search in specified model type
      const modelInfo = modelsAndTypes.find((item) => item.dbType === dbType);

      if (!modelInfo) throw new Error('invalid search type');

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          dbType === 'answer'
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        dbType,
        id:
          dbType === 'user'
            ? item.clerkId
            : dbType === 'answer'
            ? item.question
            : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (err) {
    console.log('error in fetching global results: ', err);
    throw new Error(`error in fetching global results: ${err}`);
  }
};
