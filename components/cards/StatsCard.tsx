import { formatNumberWithExtension } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface Props {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: Props) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-md border p-4 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} width={36} height={36} />
      <div className="flex flex-col items-center justify-center">
        <p className="paragraph-semibold text-dark200_light900">
          {formatNumberWithExtension(value)}
        </p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
