import { Question } from '@/components/forms/Question';
import { auth } from '@clerk/nextjs';
import React from 'react';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import { getQuestionById } from '@/lib/actions/question.actions';
import { URLProps } from '@/types';

const Page = async ({ params }: URLProps) => {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getUserById({ clerkId });
  const questionDetails = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-6">
        <Question
          type="edit"
          userId={JSON.stringify(user._id)}
          questionDetails={JSON.stringify(questionDetails)}
        />
      </div>
    </>
  );
};

export default Page;
