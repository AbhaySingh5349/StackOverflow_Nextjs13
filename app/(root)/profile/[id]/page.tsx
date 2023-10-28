import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { SignedIn, auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/shared/ProfileLink';
import Stats from '@/components/shared/Stats';
import QuestionTab from '@/components/shared/QuestionTab';
import AnswerTab from '@/components/shared/AnswerTab';
import { redirect } from 'next/navigation';

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect('/sign-in');

  const { user, questionsCount, answersCount } = await getUserInfo({
    clerkId: params.id,
  });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={user.picture}
            alt="profile picture"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>
            <div className="mt-4 flex-col items-center justify-start">
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={user.portfolio}
                  title="portfolio"
                />
              )}
              {user.loaction && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(user.joinedAt)}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-4 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats questionsCount={questionsCount} answersCount={answersCount} />
      <div className="mt-8 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              searchParams={searchParams}
              userId={user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
