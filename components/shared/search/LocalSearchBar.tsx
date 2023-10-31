'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { constructUrlQuery, removeKeysFromQuery } from '@/lib/utils';

interface Props {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');
  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        const newUrl = constructUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ['q'],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, query, searchParams, router, pathname, route]);

  console.log('Local Search Bar search query: ', search);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
