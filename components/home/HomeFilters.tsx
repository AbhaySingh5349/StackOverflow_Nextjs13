'use client';

import React, { useState } from 'react';
import { HomePageFilters } from '@/constants/filters';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { constructUrlQuery } from '@/lib/utils';

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultFilter = 'newest';
  const [active, setActive] = useState(defaultFilter);

  const handleFilter = (filter: string) => {
    if (active === filter) {
      const newUrl = constructUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: defaultFilter,
      });
      setActive(defaultFilter);
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = constructUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: filter.toLowerCase(),
      });
      setActive(filter);
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
              : ' bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400'
          }`}
          onClick={() => {
            handleFilter(filter.value);
          }}
        >
          {' '}
          {filter.name}{' '}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
