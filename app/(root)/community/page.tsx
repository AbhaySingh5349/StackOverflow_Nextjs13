import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { UserFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter';
import React from 'react';
import { getAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';
import UserCard from '@/components/cards/UserCard';
import { SearchParamsProps } from '@/types';

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-6 flex justify-between gap-2 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] flex-1"
        />
      </div>

      <section className="mt-8 flex flex-wrap gap-1">
        {result.users.length > 0 ? (
          result.users.map((user) => {
            return <UserCard key={user._id} user={user} />;
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users Found</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join to be first in the community!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;

// bands & indexes which can be used in diff scenarios
// corelate with sentinel bands
// relation between index & health
// predective modelling performance & stress analysis
// what index for what type of work (how cahl relevant to diff crops)
// if they did study for particular crop
// extract info
