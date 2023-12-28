import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import MyAnswersCard from '../cards/MyAnswersCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | undefined;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result?.answers?.map((answer: any) => {
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
          hasNext={result?.hasNext!}
        />
      </div>
    </>
  );
};

export default AnswerTab;
