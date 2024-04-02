import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { WarningColored } from "@navikt/ds-icons";
import { Accordion, BodyShort, Button, Detail } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSanity } from "../../../context/sanity-context";
import { IArbeidsforhold, useUserInformation } from "../../../context/user-information-context";
import { useValidation } from "../../../context/validation-context";
import { useGeneratorUtils } from "../../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum, IQuizSeksjon } from "../../../types/quiz.types";
import { FormattedDate } from "../../FormattedDate";
import { getUnansweredFaktumId } from "../../faktum/validation/validations.utils";
import styles from "../Arbeidsforhold.module.css";
import { CheckmarkIcon } from "./CheckmarkIcon";
import { useQuiz } from "../../../context/quiz-context";
import { useArbeidsforholdLocalStorage } from "../../../hooks/useArbeidsforholdLocalStorage";
import {
  ArbeidsforholdEndret,
  getArbeidsforholdName,
  getArbeidsforholdVarighet,
} from "./Arbeidsforhold_V2";

interface IProps {
  faktum: IQuizGeneratorFaktum;
  currentSection: IQuizSeksjon;
}

export function ArbeidsforholdAccordion({ faktum, currentSection }: IProps) {
  const router = useRouter();
  const { soknadState } = useQuiz();
  const { getAppText } = useSanity();
  const { setUnansweredFaktumId } = useValidation();
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const [accordionArbeidsforhold, setAccordionArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const [startedArbeidsforhold, setStartedArbeidsforhold] = useState<string[]>([]);
  const [finishedArbeidsforhold, setFinishedArbeidsforhold] = useState<string[]>([]);
  const { getStorageArrayByKey } = useArbeidsforholdLocalStorage();
  const { arbeidsforhold, setContextSelectedArbeidsforhold, contextSelectedArbeidsforhold } =
    useUserInformation();

  const startedListStorageKey = `aareg-started-list-${router?.query?.uuid}`;
  const removedListStorageKey = `aareg-removed-list-${router?.query?.uuid}`;
  const finishedListStorageKey = `aareg-finished-list-${router?.query?.uuid}`;

  const hasUnansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);

  const dinSituasjonSection = soknadState.seksjoner.find(
    (seksjon) => seksjon.beskrivendeId === "din-situasjon",
  );

  useEffect(() => {
    if (dinSituasjonSection?.ferdig && contextSelectedArbeidsforhold) {
      const finishedArbeidsforhold = getStorageArrayByKey<string>(finishedListStorageKey);

      finishedArbeidsforhold.push(contextSelectedArbeidsforhold.id);
      localStorage.setItem(finishedListStorageKey, JSON.stringify(finishedArbeidsforhold));
      setFinishedArbeidsforhold(finishedArbeidsforhold);

      const startedArbeidsforholdFromLocaleStorage =
        getStorageArrayByKey<string>(startedListStorageKey);
      const filteredStartedArbeidsforhold = startedArbeidsforholdFromLocaleStorage.filter(
        (id) => id !== contextSelectedArbeidsforhold.id,
      );

      setStartedArbeidsforhold(filteredStartedArbeidsforhold);
      localStorage.setItem(startedListStorageKey, JSON.stringify(filteredStartedArbeidsforhold));
    }
  }, [dinSituasjonSection]);

  useEffect(() => {
    const startedArbeidsforholdFromLocaleStorage =
      getStorageArrayByKey<string>(startedListStorageKey);
    setStartedArbeidsforhold(startedArbeidsforholdFromLocaleStorage);

    const finishedArbeidsforhold = getStorageArrayByKey<string>(finishedListStorageKey);
    setFinishedArbeidsforhold(finishedArbeidsforhold);

    const removedArbeidsforhold = getStorageArrayByKey(removedListStorageKey);
    const filteredArbeidsforhold = arbeidsforhold.filter(
      (forhold) => !removedArbeidsforhold.includes(forhold.id),
    );
    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }, []);

  function addArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }
    setContextSelectedArbeidsforhold(selectedArbeidsforhold);

    const startedArbeidsforholdFromLocaleStorage =
      getStorageArrayByKey<string>(startedListStorageKey);

    if (
      startedArbeidsforholdFromLocaleStorage &&
      !startedArbeidsforholdFromLocaleStorage.includes(selectedArbeidsforhold.id)
    ) {
      startedArbeidsforholdFromLocaleStorage.push(selectedArbeidsforhold.id);
      localStorage.setItem(
        startedListStorageKey,
        JSON.stringify(startedArbeidsforholdFromLocaleStorage),
      );
      setStartedArbeidsforhold(startedArbeidsforholdFromLocaleStorage);
      setAccordionArbeidsforhold(
        accordionArbeidsforhold.filter((forhold) => forhold.id !== selectedArbeidsforhold.id),
      );
    }
  }

  function removeArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const removedArbeidsforhold = getStorageArrayByKey(removedListStorageKey);
    removedArbeidsforhold.push(selectedArbeidsforhold.id);
    localStorage.setItem(removedListStorageKey, JSON.stringify(removedArbeidsforhold));

    const filteredArbeidsforhold = [...arbeidsforhold].filter(
      (forhold) => !removedArbeidsforhold.includes(forhold.id),
    );

    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }

  return (
    <div className={styles.accordion}>
      <Accordion>
        {[...(faktum?.svar ?? []), ...accordionArbeidsforhold]?.map((arbeidsforhold, index) => {
          if (Array.isArray(arbeidsforhold)) {
            return (
              <Accordion.Item key={index} defaultOpen={index === 0}>
                <Accordion.Header className="arbeidsforhold__accordion">
                  <div>{getArbeidsforholdName(arbeidsforhold)}</div>
                </Accordion.Header>
                <Accordion.Content>
                  <>
                    <BodyShort>{getArbeidsforholdVarighet(arbeidsforhold)}</BodyShort>
                    <ArbeidsforholdEndret fakta={arbeidsforhold}></ArbeidsforholdEndret>
                  </>
                </Accordion.Content>
              </Accordion.Item>
            );
          }

          const { id, organisasjonsnavn, startdato, sluttdato } = arbeidsforhold;
          const editing = startedArbeidsforhold.includes(id) && hasUnansweredFaktumId;
          const finished = finishedArbeidsforhold.includes(id);

          return (
            <Accordion.Item key={id} defaultOpen={index === 0}>
              <Accordion.Header className="arbeidsforhold__accordion">
                <div>{organisasjonsnavn}</div>
                <div className={styles.iconContainer}>
                  {finished && <CheckmarkIcon />}
                  {editing && !finished && <WarningColored />}
                </div>
              </Accordion.Header>
              <Accordion.Content>
                <>
                  <FormattedDate date={startdato} /> -{" "}
                  {sluttdato && <FormattedDate date={sluttdato} />}
                  {editing && !finished && (
                    <Detail uppercase>
                      <WarningColored />
                      {getAppText("generator-faktum-kort.delvis-utfylt.varsel")}
                    </Detail>
                  )}
                </>
                <div className={styles.buttonContainer}>
                  <Button
                    icon={<PencilIcon title="a11y-title" fontSize="1.5rem" />}
                    onClick={() => addArbeidsforhold(arbeidsforhold)}
                  >
                    Fyll ut
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
                    onClick={() => removeArbeidsforhold(arbeidsforhold)}
                  >
                    Fjern
                  </Button>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}
