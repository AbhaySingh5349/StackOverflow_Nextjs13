import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchProps, userId, clerkId }: Props) => {
  const { questions, questionsCount } = await getUserQuestions({
    userId,
    page: 1,
  });
  return (
    <>
      {questions?.map((question: any) => {
        return (
          <QuestionCard
            key={question._id}
            clerkId={clerkId}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        );
      })}
    </>
  );
};

export default QuestionTab;