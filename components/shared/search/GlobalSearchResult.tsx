'use client';

import React, { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';

const GlobalSearchResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([
    // { type: 'question', id: 1, title: 'nextjs' },
    // { type: 'tag', id: 1, title: 'nextjs' },
    // { type: 'user', id: 1, title: 'jsm' },
  ]);

  const globalQuery = searchParams.get('global-q');
  const dbType = searchParams.get('db-type');

  useEffect(() => {
    const fetchResults = async () => {
      setSearchResults([]);
      setIsLoading(true);

      try {
        const results = await globalSearch({ query: globalQuery, dbType });

        setSearchResults(JSON.parse(results));
      } catch (err) {
        console.log('error in fetching results for global search: ', err);
        throw new Error(`error in fetching results for global search: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (globalQuery) fetchResults();
  }, [globalQuery, dbType]);

  const renderLink = (dbType: string, id: string) => {
    switch (dbType) {
      case 'question':
        return `/question/${id}`;
      case 'answer':
        return `/question/${id}`;
      case 'user':
        return `/profile/${id}`;
      case 'tag':
        return `/tags/${id}`;
      default:
        return '/';
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <p className="text-dark400_light900 paragraph-semibold px-4">
        <GlobalFilters />
      </p>
      <div className="my-5 h-[2px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-4">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center flex flex-col px-4">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing entire database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {searchResults.length === 0 ? (
              <div className="flex-center flex flex-col px-4">
                <p className="text-dark200_light800 body-regular px-4 py-2">
                  Oops No results found
                </p>
              </div>
            ) : (
              searchResults.map((result: any, idx: number) => {
                return (
                  <Link
                    href={renderLink(result.dbType, result.id)}
                    key={result.dbType + result.id + idx}
                    className="flex w-full cursor-pointer items-start gap-2 px-4 py-2 hover:bg-light-700/50 dark:bg-dark-500/50"
                  >
                    <Image
                      src="/assets/icons/tag.svg"
                      alt="tags"
                      width={16}
                      height={16}
                      className="invert-colors mt-2 object-contain"
                    />
                    <div className="flex flex-col">
                      <p className="body-medium text-dark200_light800 line-clamp-1">
                        {result.title}
                      </p>
                      <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                        {result.dbType}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchResult;
