/* eslint-disable @next/next/no-async-client-component */
'use client';

import {
  downVoteQuestion,
  upVoteQuestion,
} from '@/lib/actions/question.actions';
import { formatNumberWithExtension } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { downVoteAnswer, upVoteAnswer } from '@/lib/actions/answer.action';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = async ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  // const router = useRouter();
  const pathname = usePathname(); // to know current URL

  const handleSave = () => {};

  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === 'upvote') {
      if (type === 'question') {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === 'answer') {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }

      // show toast
    } else if (action === 'downvote') {
      if (type === 'question') {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === 'answer') {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }

      // show toast
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-center gap-2">
        <div className="flex-center gap-1">
          <Image
            src={
              hasUpVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            alt="upvote"
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={() => {
              handleVote('upvote');
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1">
          <Image
            src={
              hasDownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            alt="downvote"
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={() => {
              handleVote('downvote');
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(downvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1">
          {type === 'question' && (
            <Image
              src={
                hasSaved
                  ? '/assets/icons/star-filled.svg'
                  : '/assets/icons/star-red.svg'
              }
              alt="star"
              width={16}
              height={16}
              className="cursor-pointer"
              onClick={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Votes;
