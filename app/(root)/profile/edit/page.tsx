import { auth } from '@clerk/nextjs';
import React from 'react';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import Profile from '@/components/forms/Profile';

const Page = async ({ params }: URLProps) => {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getUserById({ clerkId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-6">
        <Profile clerkId={clerkId} user={JSON.stringify(user)} />
      </div>
    </>
  );
};

export default Page;
