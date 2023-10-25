import React from 'react';
import Link from 'next/link';

interface Props {
  tag: {
    _id: string;
    name: string;
    description: string;
    questions: Array<object>;
    followers: Array<object>;
  };
}

const TagCard = ({ tag }: Props) => {
  return (
    <Link href={`/tags/${tag._id}`} className="shadow-light100_darknone">
      <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-6">
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <p className="paragraph-semibold text-dark300_light900">{tag.name}</p>
        </div>

        <p className="small-medium text-dark400_light500 mt-6">
          <span className="body-semibold primary-text-gradient mr-2">
            {tag.questions.length} ++
          </span>{' '}
          Questions
        </p>
      </div>
    </Link>
  );
};

export default TagCard;
