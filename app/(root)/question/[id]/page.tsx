import { getQuestionById } from '@/lib/actions/question.actions';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import Metric from '@/components/shared/Metric';
import { formatNumberWithExtension, getTimeStamp } from '@/lib/utils';
import React from 'react';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Answer from '@/components/forms/Answer';
import { getUserById } from '@/lib/actions/user.action';
import AllAnswers from '@/components/shared/AllAnswers';
import Votes from '@/components/shared/Votes';
import { redirect } from 'next/navigation';
import { URLProps } from '@/types';

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getUserById({ clerkId });

  const question = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col justify-between max-md:justify-start max-md:gap-8 max-sm:items-start max-sm:gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              alt="author profile picture"
              width={20}
              height={20}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            {/* @ts-ignore */}
            <Votes
              type="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(user._id)}
              upvotes={question.upvotes.length}
              hasUpVoted={question.upvotes.includes(user._id)}
              downvotes={question.downvotes.length}
              hasDownVoted={question.downvotes.includes(user._id)}
              hasSaved={user?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-4 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(question.createdAt)}`}
          title=" Asked "
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumberWithExtension(question.answers.length)}
          title=" Answers "
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumberWithExtension(question.views)}
          title=" Views "
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-6 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => {
          return (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          );
        })}
      </div>
      {/* @ts-ignore */}
      <AllAnswers
        questionId={question._id}
        userId={user._id}
        totalAnswers={question.answers.length}
        page={searchParams?.page!}
        filter={searchParams?.filter!}
      />

      <Answer
        question={question.content}
        questionId={JSON.stringify(question._id)}
        userId={JSON.stringify(user._id)}
      />
    </>
  );
};

export default Page;
