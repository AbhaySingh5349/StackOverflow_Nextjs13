import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { TagFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter';
import React from 'react';
import { getAllTags } from '@/lib/actions/tag.actions';
import TagCard from '@/components/cards/TagCard';
import NoResultFound from '@/components/shared/NoResultFound';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { tags, hasNext } = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  // const isLoading = true;
  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-6 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] flex-1"
        />
      </div>

      <section className="mt-8 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => {
            return <TagCard key={tag._id} tag={tag} />;
          })
        ) : (
          <NoResultFound
            title="No Tags Found"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>

      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          hasNext={hasNext}
        />
      </div>
    </>
  );
};

export default Page;
