'use client';

import React, { useEffect, useState, useRef } from 'react';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { constructUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalSearchResult from './GlobalSearchResult';

export const GlobalSearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchConainerRef = useRef(null);

  const query = searchParams.get('q'); // coming from local search
  const [search, setSearch] = useState(query || '');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchConainerRef.current &&
        // @ts-ignore
        !searchConainerRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // any event listener in useEffect needs to be cleared
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };

    // setIsModalOpen(false);
  }, [pathname]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        const newUrl = constructUrlQuery({
          params: searchParams.toString(),
          key: 'global-q',
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        // check if local search exists
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ['global-q', 'db-type'],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, query, searchParams, router, pathname]);

  console.log('Global Search Bar search query: ', search);

  return (
    <div
      ref={searchConainerRef}
      className="relative w-full max-w-[600px] max-lg:hidden"
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="global search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search Globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isModalOpen) setIsModalOpen(true);

            if (e.target.value.trim() === '' && isModalOpen)
              setIsModalOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isModalOpen && <GlobalSearchResult />}
    </div>
  );
};
