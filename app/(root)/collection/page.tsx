import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import Filter from '@/components/shared/Filter';
import { QuestionFilters } from '@/constants/filters';
import NoResultFound from '@/components/shared/NoResultFound';
import QuestionCard from '@/components/cards/QuestionCard';
import { getSavedQuestions } from '@/lib/actions/question.actions';
import { auth } from '@clerk/nextjs';

export default async function Home() {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const { questions } = await getSavedQuestions({ clerkId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-6 flex justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length === 0 ? (
          <NoResultFound
            title="There are no saved questions to display"
            link="/"
            linkTitle="Save a Question"
          />
        ) : (
          questions.map((question) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            );
          })
        )}
      </div>
    </>
  );
}