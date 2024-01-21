'use client';

import { AnswerSchema } from '@/lib/validations';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createAnswer } from '@/lib/actions/answer.action';
import { toast } from '../ui/use-toast';

interface Props {
  question: string;
  questionId: string;
  userId: string;
}

const Answer = ({ question, questionId, userId }: Props) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const pathname = usePathname(); // to know current URL

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  });

  // 2. Define a submit handler.
  async function handleCreateAnswer(values: z.infer<typeof AnswerSchema>) {
    setIsSubmitting(true);

    try {
      // async call to create answer (contain form data)
      await createAnswer({
        content: values.answer,
        author: JSON.parse(userId),
        questionId: JSON.parse(questionId),
        path: pathname,
      });

      // resetting form so that we can add another answer
      form.reset();

      // clear editor
      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent('');
      }

      toast({
        title: 'Answer added',
      });
    } catch (err) {
    } finally {
      setIsSubmitting(false); // either error or successfull creation of answer
    }
  }

  const generateAIAnswer = async () => {
    if (!userId) return;

    setIsSubmittingAI(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        { method: 'POST', body: JSON.stringify({ question }) }
      );
      const aiAnswer = await response.json();

      // to display answer in UI, we need to convert text to HTML format
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, '<br />'); // replacing new line globally with break tag
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }

      toast({
        title: 'AI Answer generated',
      });
    } catch (err) {
      console.log(`error while generating AI Answer: ${err}`);
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-end">
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2 text-primary-500 shadow-none dark:text-primary-500"
          onClick={generateAIAnswer}
          disabled={isSubmittingAI}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Add Answer to above problem{' '}
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
                    initialValue=""
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
                  Add answer to the problem. (Min. 5 characters)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-light-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
