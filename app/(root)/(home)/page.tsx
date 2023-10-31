import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import Filter from '@/components/shared/Filter';
import { HomePageFilters } from '@/constants/filters';
import HomeFilters from '@/components/home/HomeFilters';
import NoResultFound from '@/components/shared/NoResultFound';
import QuestionCard from '@/components/cards/QuestionCard';
import {
  getQuestions,
  getRecommendedQuestions,
} from '@/lib/actions/question.actions';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Dev Overflow',
  description: 'Dev overflow is a community of 1000+ developers. Join Us!',
};

/*
const dummyQuestions = [
  {
    _id: '1',
    title: 'How to use express as custom server in NextJS ?',
    tags: [
      { _id: '1', name: 'next' },
      { _id: '2', name: 'express' },
    ],
    author: {
      _id: '1',
      name: 'abhay',
      picture: 'abhay.jpg',
    },
    upvotes: 10,
    views: 1420,
    answers: [],
    createdAt: new Date('2023-10-23T12:00:00.000Z'),
  },
  {
    _id: '2',
    title: 'Cascading deletes in SQLAlchemy ?',
    tags: [{ _id: '1', name: 'SQLAlchemy' }],
    author: {
      _id: '2',
      name: 'aayush',
      picture: 'aayush.jpg',
    },
    upvotes: 5,
    views: 80,
    answers: [],
    createdAt: new Date('2021-09-01T12:00:00.000Z'),
  },
  {
    _id: '3',
    title:
      'Roadmap for web development with nextjs, mobile development, machine learning, blockchain development ?',
    tags: [
      { _id: '1', name: 'web dev' },
      { _id: '2', name: 'next' },
      { _id: '3', name: 'mobile dev' },
      { _id: '4', name: 'machine learning' },
      { _id: '5', name: 'blockchain dev' },
    ],
    author: {
      _id: '3',
      name: 'aakash',
      picture: 'aakash.jpg',
    },
    upvotes: 12,
    views: 150,
    answers: [],
    createdAt: new Date('2021-09-01T12:00:00.000Z'),
  },
  {
    _id: '4',
    title: 'How to master DSA ?',
    tags: [{ _id: '1', name: 'DSA' }],
    author: {
      _id: '1',
      name: 'abhay',
      picture: 'abhay.jpg',
    },
    upvotes: 15,
    views: 200,
    answers: [],
    createdAt: new Date('2021-09-01T12:00:00.000Z'),
  },
  {
    _id: '5',
    title: 'How to crack MAANG interviews ?',
    tags: [
      { _id: '1', name: 'interviews' },
      { _id: '2', name: 'MAANG' },
    ],
    author: {
      _id: '4',
      name: 'kushagra',
      picture: 'kushagra.jpg',
    },
    upvotes: 12,
    views: 400,
    answers: [],
    createdAt: new Date('2021-09-01T12:00:00.000Z'),
  },
];
*/

export default async function Home({ searchParams }: SearchParamsProps) {
  let result;

  if (searchParams?.filter === 'recommended') {
    const { userId: clerkId } = auth();
    if (!clerkId) redirect('/sign-in');

    result = await getRecommendedQuestions({
      clerkId,
      page: searchParams.page ? +searchParams.page : 1,
    });
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  // const isLoading = true;
  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask A Question
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] flex-1"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result?.questions?.length === 0 ? (
          <NoResultFound
            title="There are no questions to display"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        ) : (
          result?.questions?.map((question) => {
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

      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          hasNext={result?.hasNext}
        />
      </div>
    </>
  );
}
