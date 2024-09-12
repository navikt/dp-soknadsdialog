import {
  BodyLong,
  BodyShort,
  Button,
  Detail,
  Heading,
  Label,
  Modal,
  ReadMore,
} from "@navikt/ds-react";
import { useRouter } from "next/router";
import { Ref, forwardRef, useEffect } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useUserInfo } from "../../context/user-info-context";
import { useValidation } from "../../context/validation-context";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { BriefcaseAdd } from "../../svg-icons/BriefcaseAdd";
import {
  IQuizGeneratorFaktum,
  IQuizPeriodeFaktumAnswerType,
  QuizFaktum,
} from "../../types/quiz.types";
import { findArbeidstid } from "../../utils/arbeidsforhold.utils";
import { findEmployerName } from "../../utils/faktum.utils";
import { FormattedDate } from "../FormattedDate";
import { IFaktum } from "../faktum/Faktum";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { getUnansweredFaktumId } from "../faktum/validation/validations.utils";
import { FetchIndicator } from "../fetch-indicator/FetchIndicator";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { ArbeidsforholdFaktumWrapper } from "./ArbeidsforholdFaktumWrapper";
import styles from "./Arbeidsforhold.module.css";

export const Arbeidsforhold = forwardRef(ArbeidsforholdComponent);

function getArbeidsforholdDescriptionBySelectedArbeidstid(arbeidstid: string): string {
  switch (arbeidstid) {
    case "faktum.type-arbeidstid.svar.fast":
      return "arbeidsforhold.dynamic-description.arbeidstid-last-6-months";
    case "faktum.type-arbeidstid.svar.varierende":
      return "arbeidsforhold.dynamic-description.arbeidstid-last-12-months";
    case "faktum.type-arbeidstid.svar.kombinasjon":
      return "arbeidsforhold.dynamic-description.arbeidstid-last-36-months";
    default:
      return "";
  }
}

function ArbeidsforholdComponent(
  props: IFaktum<IQuizGeneratorFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const router = useRouter();
  const { faktum } = props;
  const { isLoading, soknadState } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const { arbeidsforhold } = useUserInfo();

  const { getAppText, getFaktumTextById } = useSanity();
  const {
    addNewGeneratorAnswer,
    deleteGeneratorAnswer,
    toggleActiveGeneratorAnswer,
    activeIndex,
    closeGeneratorAnswer,
  } = useGeneratorUtils();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const sectionParam = router.query.seksjon as string;
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const currentSection = soknadState.seksjoner[sectionIndex];
  const arbeidstid = findArbeidstid(soknadState);

  // Set active index to open modal when adding a new arbeidsforhold. Quiz returns an array with 1 faktum after adding a new arbeidsforhold.
  useEffect(() => {
    if (faktum?.svar) {
      const lastGeneratorAnswerIndex = faktum.svar.length - 1;
      const lastGeneratorAnswer = faktum.svar[lastGeneratorAnswerIndex];

      if (lastGeneratorAnswer?.length === 1 && !lastGeneratorAnswer[0].svar) {
        toggleActiveGeneratorAnswer(lastGeneratorAnswerIndex);
      }
    }
  }, [faktum?.svar?.length]);

  function addArbeidsforhold(faktum: IQuizGeneratorFaktum) {
    const hasUnansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);

    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }
  }

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <Label as={"p"} spacing>
        {faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
      </Label>
      {arbeidstid && (
        <BodyShort className={styles.dynamicText}>
          {getAppText(getArbeidsforholdDescriptionBySelectedArbeidstid(arbeidstid))}
        </BodyShort>
      )}
      {faktum?.svar?.map((fakta, svarIndex) => {
        const unansweredFaktum = fakta.find((faktum) => faktum?.svar === undefined);
        const shouldShowValidationMessage = fakta.some(
          (faktum: QuizFaktum) => faktum.id === unansweredFaktumId,
        );

        return (
          <div key={svarIndex}>
            <GeneratorFaktumCard
              generatorFaktumType="arbeidsforhold"
              allFaktumAnswered={!unansweredFaktum}
              editFaktum={() => toggleActiveGeneratorAnswer(svarIndex)}
              deleteFaktum={() => deleteGeneratorAnswer(faktum, svarIndex)}
              showValidationMessage={shouldShowValidationMessage}
            >
              <Heading level={"3"} size={"small"} spacing>
                {getArbeidsforholdName(fakta)}
              </Heading>
              <BodyShort>{getArbeidsforholdVarighet(fakta)}</BodyShort>
              <ArbeidsforholdEndret fakta={fakta}></ArbeidsforholdEndret>
            </GeneratorFaktumCard>

            <Modal
              className="modal-container modal-container--generator"
              header={{ heading: getAppText("arbeidsforhold.knapp.legg-til") }}
              open={activeIndex === svarIndex}
              onClose={closeGeneratorAnswer}
              closeOnBackdropClick
            >
              <Modal.Body>
                <>
                  {arbeidstid && arbeidsforhold.length === 0 && (
                    <BodyLong className={styles.description} spacing>
                      {getAppText(getArbeidsforholdDescriptionBySelectedArbeidstid(arbeidstid))}
                    </BodyLong>
                  )}
                  {arbeidsforhold.length > 0 && (
                    <>
                      <BodyLong className={styles.description}>
                        {getAppText("arbeidsforhold.modal.beskrivelse")}
                      </BodyLong>
                      <ReadMore
                        header={getAppText("arbeidsforhold.modal.readmore-header")}
                        className={styles.modalReadmore}
                        defaultOpen={false}
                      >
                        {getAppText("arbeidsforhold.modal.readmore-innhold")}
                      </ReadMore>
                    </>
                  )}
                  <ArbeidsforholdFaktumWrapper fakta={fakta} readonly={props.readonly} />
                </>
                <FetchIndicator isLoading={isLoading} />
                <div className={"modal-container__button-container"}>
                  <Button onClick={closeGeneratorAnswer}>
                    {getAppText("soknad.generator.lagre-og-lukk-knapp")}
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        );
      })}
      <Button
        variant="secondary"
        className={"generator-faktum__add-button"}
        onClick={() => addArbeidsforhold(faktum)}
        icon={<BriefcaseAdd />}
      >
        {getAppText("arbeidsforhold.knapp.legg-til")}
      </Button>
      {unansweredFaktumId === faktum.id && (
        <ValidationMessage message={getAppText("validering.faktum.ubesvart")} />
      )}
    </div>
  );
}

export function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return findEmployerName(arbeidsforhold) ?? "Fant ikke navn på arbeidsgiver";
}

export function getArbeidsforholdVarighet(arbeidsforhold: QuizFaktum[]) {
  const varighetFaktum = arbeidsforhold.find(
    (answer) => answer.beskrivendeId === "faktum.arbeidsforhold.varighet",
  )?.svar as IQuizPeriodeFaktumAnswerType;

  if (!varighetFaktum) return <></>;

  return (
    <>
      {varighetFaktum.fom && <FormattedDate date={varighetFaktum.fom} />}
      {varighetFaktum.tom && (
        <>
          {`- `}
          <FormattedDate date={varighetFaktum.tom} />
        </>
      )}
    </>
  );
}

export function getArbeidsforholdEndret(arbeidsforhold: QuizFaktum[]): string {
  return arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.arbeidsforhold.endret")
    ?.svar as string;
}

function ArbeidsforholdEndret({ fakta }: { fakta: QuizFaktum[] }) {
  const { getSvaralternativTextById } = useSanity();

  const arbeidsforholdEndret = getArbeidsforholdEndret(fakta);
  if (!arbeidsforholdEndret) return null;

  return (
    <Detail uppercase spacing>
      <>{getSvaralternativTextById(arbeidsforholdEndret)?.text}</>
    </Detail>
  );
}
