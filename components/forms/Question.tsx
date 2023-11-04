'use client';

import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';

import { QuestionSchema } from '@/lib/validations';
import { createQuestion, editQuestion } from '@/lib/actions/question.actions';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import { toast } from '../ui/use-toast';

interface Props {
  type?: string;
  userId: string;
  questionDetails?: string;
}

export const Question = ({ type, userId, questionDetails }: Props) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // to know current URL

  // let parsedQuestionDetails = {};
  // if (questionDetails) parsedQuestionDetails = JSON.parse(questionDetails);

  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails || '');

  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || '',
      explanation: parsedQuestionDetails?.content || '',
      tags: groupedTags || [],
    },
  });

  // 2. Define a submit handler.
  async function handleCreateQuestion(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true);

    try {
      if (type === 'edit') {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.title,
          path: pathname,
        });
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        // async call to create question (contain form data)
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(userId),
          path: pathname!,
        });

        toast({
          title: 'Question added',
        });

        // navigate to home page
        router.push('/');
      }
    } catch (err) {
    } finally {
      setIsSubmitting(false); // either error or successfull creation of question
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault(); // since submit event reloads browser

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag exceeds limit of 15 characters',
          });
        }

        // tag should not already exist in field
        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = '';
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue('tags', newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px]"
                  //   placeholder="question title..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2 text-light-500">
                Be specific while asking question in community
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed Explanation to Question{' '}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails?.content || ''}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'code',
                      'help',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter | ' +
                      'alignright alignjustify | bullist numlist | ',
                    content_style:
                      'body { font-family:Inter,sans-serif; font-size:16px }',
                    skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: mode === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2 text-light-500">
                Introduce the problem and expand what you put in the title.
                (Min. 20 characters)
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px]"
                    placeholder="add tags..."
                    disabled={type === 'edit'}
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2 gap-2">
                      {field.value.map((tag: any) => {
                        return (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center gap-2 rounded-md border-none px-4 py-2"
                            onClick={
                              type !== 'edit'
                                ? () => handleTagRemove(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== 'edit' && (
                              <Image
                                src="/assets/icons/close.svg"
                                alt="close icon"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            )}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2 text-light-500">
                Add upto 5 tags related to your question. (press enter to add)
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <> {type === 'edit' ? 'Editing...' : 'Posting...'} </>
          ) : (
            <> {type === 'edit' ? 'Edit Question' : 'Ask Question'} </>
          )}
        </Button>
      </form>
    </Form>
  );
};
