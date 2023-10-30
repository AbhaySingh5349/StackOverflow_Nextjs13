import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';
import MyAnswersCard from '../cards/MyAnswersCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { answers, answersCount, hasNext } = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
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

      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          hasNext={hasNext}
        />
      </div>
    </>
  );
};

export default AnswerTab;
