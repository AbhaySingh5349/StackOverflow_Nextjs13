import { getQuestionByTagId } from '@/lib/actions/tag.actions';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import NoResultFound from '@/components/shared/NoResultFound';
import QuestionCard from '@/components/cards/QuestionCard';
import React from 'react';
import { URLProps } from '@/types';
// import { QuestionInterface } from '@/database/question.model';

const Page = async ({ params, searchParams }: URLProps) => {
  const { tagTitle, questions } = await getQuestionByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

      <div className="mt-6 w-full">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length === 0 ? (
          <NoResultFound
            title="There are no tag questions to display"
            link="/"
            linkTitle="Ask a Question"
          />
        ) : (
          questions.map((question: any) => {
            return (
              <QuestionCard
                key={question._id}
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
          })
        )}
      </div>
    </>
  );
};

export default Page;