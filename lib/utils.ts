import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { BADGE_CRITERIA } from '@/constants';
import { BadgeCounts } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - createdAt?.getTime());

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    const seconds = Math.floor(diff / 1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

export const formatNumberWithExtension = (number: number): string => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number?.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

// takes current url, checks for filters & queries, update values which we want to update while keeping others same
export const constructUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keys: string[];
}

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
