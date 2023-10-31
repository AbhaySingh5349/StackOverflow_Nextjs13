import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="my-10 flex flex-wrap gap-4">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
          return (
            <Skeleton
              key={item}
              className="h-60 w-full rounded-xl sm:w-[260px]"
            />
          );
        })}
      </div>
    </section>
  );
};

export default Loading;
