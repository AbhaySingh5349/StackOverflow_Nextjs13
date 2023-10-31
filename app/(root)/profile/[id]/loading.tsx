import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Skeleton className="h-[120px] w-[120px] rounded-full" />
          <div className="mt-2 flex flex-col gap-4">
            <Skeleton className="h-3 min-w-[148px]" />
            <Skeleton className="h-3 min-w-[148px]" />
            <Skeleton className="h-3 min-w-[148px]" />
            <Skeleton className="h-3 min-w-[148px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <Skeleton className="mt-4 h-10 w-[120px]" />
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4">
        <Skeleton className="h-28 rounded-md" />
        <Skeleton className="h-28 rounded-md" />
        <Skeleton className="h-28 rounded-md" />
        <Skeleton className="h-28 rounded-md" />
      </div>

      <div className="mt-8 flex gap-8">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24 rounded-l-none" />
          </div>
          <div className="mt-4 flex w-full flex-col gap-4">
            {[1, 2, 3, 4].map((item) => {
              return <Skeleton key={item} className="h-48 w-full rounded-xl" />;
            })}
          </div>
        </div>

        <div className="flex min-w-[278px] flex-col max-lg:hidden">
          <Skeleton className="h-7 w-10" />
          <div className="mt-6 flex flex-col gap-4">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
