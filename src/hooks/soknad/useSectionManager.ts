import { useRouter } from "next/router";
import { IQuizState } from "../../localhost-data/quiz-state-response";

export function useSectionManager(soknadState: IQuizState) {
  const router = useRouter();

  const sectionParam = parseInt(router.query.seksjon as string);

  const isValidSection = sectionParam && !!soknadState.seksjoner[sectionParam - 1];

  let sectionIndex, nextSectionParam, previousSectionParam;

  if (!isNaN(sectionParam) && isValidSection) {
    sectionIndex = sectionParam - 1;

    nextSectionParam = sectionParam + 1;
    previousSectionParam = sectionParam - 1;
  } else {
    // Show first section if nothing else is specified
    sectionIndex = 0;
    nextSectionParam = 2;
  }

  const isFirstSection = sectionIndex === 0;
  const currentSection = soknadState.seksjoner[sectionIndex];

  const firstUnansweredFaktumIndex = currentSection?.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  const nextUnansweredFaktumIndex =
    firstUnansweredFaktumIndex === -1 ? currentSection.fakta.length : firstUnansweredFaktumIndex;

  return {
    isFirstSection,
    isValidSection,
    nextSectionParam,
    previousSectionParam,
    currentSection,
    nextUnansweredFaktumIndex,
  };
}
