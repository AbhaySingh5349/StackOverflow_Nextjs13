import { formatNumberWithExtension, getTimeStamp } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import Metric from '../shared/Metric';
import { SignedIn } from '@clerk/nextjs';
import EditDeteleActions from '../shared/EditDeteleActions';

interface Props {
  clerkId?: string;
  _id: string;
  question: { _id: string; title: string };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: Array<object>;
  createdAt: Date;
}

const MyAnswersCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionBtns = clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-6 sm:px-10">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${question._id}/#${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {/* allow edit/delete answer if signed in */}
        <SignedIn>
          {showActionBtns && (
            <EditDeteleActions type="answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - answered ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatNumberWithExtension(upvotes.length)}
          title=" Votes "
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default MyAnswersCard;
