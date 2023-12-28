import React from 'react';
import Filter from './Filter';
import { AnswerFilters } from '../../constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: string;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const { answers, hasNext } = await getAnswers({
    questionId,
    page: page ? +page : 1,
    filter,
  });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <section>
        {answers.length > 0 ? (
          answers.map((answer: any) => {
            return (
              <AnswerCard key={answer._id} answer={answer} userId={userId} />
            );
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto mt-8 text-center font-bold text-accent-blue">
            <p>Be first in the community to answer this question</p>
          </div>
        )}
      </section>

      <div className="mt-8 w-full">
        <Pagination pageNumber={page ? +page : 1} hasNext={hasNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
