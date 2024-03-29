import { Question } from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getUserById({ clerkId });
  console.log('ask-question user: ', user);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask Question</h1>
      <div className="mt-6">
        <Question userId={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default Page;
