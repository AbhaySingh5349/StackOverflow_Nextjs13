'use client';

import { GlobalSearchFilters } from '@/constants/filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { constructUrlQuery } from '@/lib/utils';
import React, { useState } from 'react';

const GlobalFilters = () => {
  //   const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dbTypeParams = searchParams.get('db-type');

  const [activeDb, setActiveDb] = useState(dbTypeParams || '');

  const handleDbType = (dbType: string) => {
    if (activeDb === dbType) {
      const newUrl = constructUrlQuery({
        params: searchParams.toString(),
        key: 'db-type',
        value: null,
      });
      setActiveDb('');
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = constructUrlQuery({
        params: searchParams.toString(),
        key: 'db-type',
        value: dbType.toLowerCase(),
      });
      setActiveDb(dbType);
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-2">
        {GlobalSearchFilters.map((filter) => {
          return (
            <button
              type="button"
              key={filter.name}
              onClick={() => {
                handleDbType(filter.value);
              }}
              className={`light-border-2 small-medium rounded-2xl px-6 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${
                activeDb === filter.value
                  ? 'bg-primary-500 text-light-900'
                  : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'
              }`}
            >
              {filter.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalFilters;
