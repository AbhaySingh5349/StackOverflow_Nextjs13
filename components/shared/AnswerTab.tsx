import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';
import MyAnswersCard from '../cards/MyAnswersCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchProps, userId, clerkId }: Props) => {
  const { answers, answersCount } = await getUserAnswers({
    userId,
    page: 1,
  });
  return (
    <>
      {answers?.map((answer: any) => {
        return (
          <MyAnswersCard
            key={answer._id}
            clerkId={clerkId}
            _id={answer._id}
            question={answer.questionId}
            author={answer.author}
            upvotes={answer.upvotes}
            createdAt={answer.createdAt}
          />
        );
      })}
    </>
  );
};

export default AnswerTab;
