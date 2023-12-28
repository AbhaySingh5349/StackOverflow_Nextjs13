import React from 'react';
import ParseHTML from '@/components/shared/ParseHTML';
import Link from 'next/link';
import Image from 'next/image';
import { getTimeStamp } from '@/lib/utils';
import Votes from '../shared/Votes';

interface Props {
  answer: {
    _id: string;
    author: {
      _id: string;
      clerkId: string;
      name: string;
      picture: string;
    };
    content: string;
    upvotes: Array<Object>;
    downvotes: Array<Object>;
    createdAt: Date;
  };
  userId: string;
}

const AnswerCard = ({ answer, userId }: Props) => {
  return (
    <div className="background-light900_dark200 light-border mt-4 flex w-full flex-col justify-center rounded-2xl border p-4">
      <div className="flex flex-col gap-4">
        <div className="mb-4 flex flex-col justify-between max-md:justify-start max-md:gap-8 max-sm:items-start max-sm:gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/profile/${answer.author.clerkId}`}
            className="flex-start flex gap-2 max-sm:justify-center"
          >
            <Image
              src={answer.author.picture}
              alt="profile picture"
              width={20}
              height={20}
              className="rounded-full object-cover"
            />

            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="paragraph-semibold text-dark300_light700 line-clamp-1">
                {answer.author.name}
              </p>
              <p className="small-regular text-light400_light500 ml-0.5 mt-1 line-clamp-1">
                answered {getTimeStamp(answer.createdAt)}
              </p>
            </div>
          </Link>
          <div className="flex">
            {/* @ts-ignore */}
            <Votes
              type="answer"
              itemId={JSON.stringify(answer._id)}
              userId={JSON.stringify(userId)}
              upvotes={answer.upvotes.length}
              hasUpVoted={answer.upvotes.includes(userId)}
              downvotes={answer.downvotes.length}
              hasDownVoted={answer.downvotes.includes(userId)}
            />
          </div>
        </div>
        <ParseHTML data={answer.content} />
      </div>
    </div>
  );
};

export default AnswerCard;
