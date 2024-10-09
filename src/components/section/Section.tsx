import { useFeatureToggles } from "../../context/feature-toggle-context";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { ErrorTypesEnum } from "../../types/error.types";
import { IOpplysning } from "../../types/orkestrator.types";
import { IQuizSeksjon } from "../../types/quiz.types";
import { mapOrkestratorToQuiz } from "../../utils/orkestrator.util";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { Faktum } from "../faktum/Faktum";
import { SectionHeading } from "./SectionHeading";

interface IProps {
  section: IQuizSeksjon;
  readonly?: boolean;
  showAllTexts?: boolean;
}

export function Section(props: IProps) {
  const { getSeksjonTextById } = useSanity();
  const { orkestratorState } = useQuiz();
  const { soknadsdialogMedOrkestratorIsEnabled } = useFeatureToggles();
  const sectionTexts = getSeksjonTextById(props.section.beskrivendeId);
  const firstUnansweredFaktum = props.section.fakta.find((faktum) => faktum.svar === undefined);
  const firstUnansweredIndex = props.section.fakta.findIndex(
    (faktum) => faktum.id === firstUnansweredFaktum?.id,
  );

  if (!props.section.beskrivendeId) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  if (soknadsdialogMedOrkestratorIsEnabled && orkestratorState) {
    const { nesteUbesvarteOpplysning, besvarteOpplysninger } = orkestratorState;

    const nesteUbesvartOpplysningToFaktum =
      nesteUbesvarteOpplysning && mapOrkestratorToQuiz(orkestratorState.nesteUbesvarteOpplysning);

    return (
      <>
        <SectionHeading
          text={getSeksjonTextById(orkestratorState.navn)}
          fallback={orkestratorState.navn}
          showAllTexts={props.showAllTexts}
        />
        {besvarteOpplysninger?.map((opplysning: IOpplysning) => {
          const opplysningToFaktum = mapOrkestratorToQuiz(opplysning);

          return (
            <Faktum
              key={opplysningToFaktum.id}
              faktum={opplysningToFaktum}
              readonly={props.readonly}
              showAllFaktumTexts={props.showAllTexts}
              isOrkestrator={true}
            />
          );
        })}

        {nesteUbesvarteOpplysning && (
          <Faktum
            key={nesteUbesvartOpplysningToFaktum.id}
            faktum={nesteUbesvartOpplysningToFaktum}
            readonly={props.readonly}
            showAllFaktumTexts={props.showAllTexts}
            isOrkestrator={true}
          />
        )}
      </>
    );
  }

  return (
    <>
      <SectionHeading
        text={sectionTexts}
        fallback={props.section.beskrivendeId}
        showAllTexts={props.showAllTexts}
      />
      {props.section?.fakta?.map((faktum, index) => {
        // We should always only show one unanswered faktum at a time. The backend should ideally do it, but that is not always the case
        if (index <= firstUnansweredIndex || firstUnansweredIndex === -1)
          return (
            <Faktum
              key={faktum.beskrivendeId}
              faktum={faktum}
              readonly={props.readonly}
              showAllFaktumTexts={props.showAllTexts}
            />
          );
      })}
    </>
  );
}
