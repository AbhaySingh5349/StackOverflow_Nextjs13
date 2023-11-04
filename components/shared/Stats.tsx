import { formatNumberWithExtension } from '@/lib/utils';
import { BadgeCounts } from '@/types';
import React from 'react';
import StatsCard from '../cards/StatsCard';

interface Props {
  questionsCount: number;
  answersCount: number;
  badgeCounts: BadgeCounts;
  reputation: number;
}

const Stats = ({
  questionsCount,
  answersCount,
  badgeCounts,
  reputation,
}: Props) => {
  return (
    <div className="mt-6">
      <h3 className="h3-semibold text-dark200_light900">
        Stats - {reputation}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-4 shadow-light-300 dark:shadow-dark-200">
          <div className="flex flex-col items-center justify-center">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumberWithExtension(questionsCount!)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
        </div>
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-4 shadow-light-300 dark:shadow-dark-200">
          <div className="flex flex-col items-center justify-center">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumberWithExtension(answersCount!)}
            </p>
            <p className="body-medium text-dark400_light700">answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badgeCounts?.GOLD!}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badgeCounts?.SILVER!}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badgeCounts?.BRONZE!}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
