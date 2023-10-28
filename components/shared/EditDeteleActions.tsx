'use client';

import { deleteQuestion } from '@/lib/actions/question.actions';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { deleteAnswer } from '@/lib/actions/answer.action';

interface Props {
  type: string;
  itemId: string;
}

const EditDeteleActions = ({ type, itemId }: Props) => {
  const pathname = usePathname(); // to know current URL
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === 'question') {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === 'answer') {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 max-sm:w-full">
      {type === 'question' && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={16}
          height={16}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={16}
        height={16}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeteleActions;
