import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { UserFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter';
import React from 'react';
import { getAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';
import UserCard from '@/components/cards/UserCard';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Dev Overflow',
  description: 'Dev overflow is a community of 1000+ developers. Join Us!',
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { users, hasNext } = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  // const isLoading = true;
  // if (isLoading) {
  //   return <Looading />;
  // }

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
        {users.length > 0 ? (
          users.map((user) => {
            // @ts-ignore
            return <UserCard key={user._id} user={user} />;
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users Found</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join the amazing developers community!
            </Link>
          </div>
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
