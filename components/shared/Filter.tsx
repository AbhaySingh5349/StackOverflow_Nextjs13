'use client';

import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { constructUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParam = searchParams.get('filter') || ''; // state for filter

  const handleFilter = (filter: string) => {
    const newUrl = constructUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value: filter,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleFilter} defaultValue={filterParam}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 w-[180px] border px-5 py-2.5`}
        >
          <SelectValue placeholder="Select a filter" />
          {/* <div className="line-clamp-1"></div> */}
        </SelectTrigger>

        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => {
              return (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                  className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                >
                  {filter.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
