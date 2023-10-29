import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import RenderTag from './RenderTag';
import { getTopQuestions } from '@/lib/actions/question.actions';
import { getPopularTags } from '@/lib/actions/tag.actions';

/*
const topQuestions = [
    { _id: '1', title: 'How to use express as custom server in NextJS ?' },
    { _id: '2', title: 'Cascading deletes in SQLAlchemy ?' },
    {
      _id: '3',
      title:
        'Roadmap for web development, mobile development, machine learning, blockchain development ?',
    },
    { _id: '4', title: 'How to master DSA ?' },
    { _id: '5', title: 'How to crack MAANG interviews ?' },
  ];

  const popularTags = [
    { _id: '1', name: 'javascript', questionsCount: 5 },
    { _id: '2', name: 'react', questionsCount: 4 },
    { _id: '3', name: 'next', questionsCount: 4 },
    { _id: '4', name: 'android', questionsCount: 6 },
    { _id: '5', name: 'java', questionsCount: 8 },
  ];
  */

const RightSideBar = async () => {
  const topQuestions = await getTopQuestions();
  const popularTags = await getPopularTags();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top-Questions</h3>
        <div className="mt-6 flex w-full flex-col gap-[15px]">
          {topQuestions.map((question) => {
            return (
              <Link
                href={`/question/${question._id}`}
                key={question._id}
                className="flex cursor-pointer items-center justify-between gap-6"
              >
                <p className="body-medium text-dark500_light700">
                  {question.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-6 flex flex-col gap-4">
          {popularTags.map((tag) => {
            return (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questionsCount={tag.questionsCount}
                showCount
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
