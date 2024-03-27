import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { WarningColored } from "@navikt/ds-icons";
import { Accordion, Button, Detail } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { IArbeidsforhold, useUserInformation } from "../../context/user-information-context";
import { useValidation } from "../../context/validation-context";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum, IQuizSeksjon } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import { getUnansweredFaktumId } from "../faktum/validation/validations.utils";
import styles from "./Arbeidsforhold.module.css";
import { CheckmarkIcon } from "./arbeidsforhold-v2/CheckmarkIcon";
import { useQuiz } from "../../context/quiz-context";

interface IProps {
  faktum: IQuizGeneratorFaktum;
  currentSection: IQuizSeksjon;
}

export function ArbeidsforholdAccordion({ faktum, currentSection }: IProps) {
  const router = useRouter();
  const { soknadState } = useQuiz();
  const [accordionArbeidsforhold, setAccordionArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const [filledArbeidsforhold, setFilledArbeidsforhold] = useState<string[]>([]);
  const [finishedArbeidsforhold, setFinishedArbeidsforhold] = useState<string[]>([]);
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const { setUnansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();
  const { arbeidsforhold, setContextSelectedArbeidsforhold, contextSelectedArbeidsforhold } =
    useUserInformation();
  const hasUnansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);

  const dinSituasjon = soknadState.seksjoner.find(
    (seksjon) => seksjon.beskrivendeId === "din-situasjon",
  );

  useEffect(() => {
    if (dinSituasjon?.ferdig && contextSelectedArbeidsforhold) {
      const finishedListStorageKey = `aareg-finished-list-${router?.query?.uuid}`;
      const finishedArbeidsforhold = localStorage?.getItem(`${finishedListStorageKey}`);
      const finishedArbeidsforholdList = finishedArbeidsforhold
        ? JSON.parse(finishedArbeidsforhold)
        : [];

      finishedArbeidsforholdList.push(contextSelectedArbeidsforhold.id);
      localStorage.setItem(`${finishedListStorageKey}`, JSON.stringify(finishedArbeidsforholdList));
      setFinishedArbeidsforhold(finishedArbeidsforholdList);
    }
  }, [dinSituasjon]);

  useEffect(() => {
    initLocalStorageAAREGArbeidsforholdRemovedList();
    initLocalStorageAAREGArbeidsforholdFilledList();
    initLocalStorageAAREGArbeidsforholdFinishedList();
  }, []);

  function initLocalStorageAAREGArbeidsforholdRemovedList() {
    // Init arbeidsforhold removed list to localStorage
    const removedListStorageKey = `aareg-removed-list-${router?.query?.uuid}`;
    const removedArbeidsforhold = localStorage?.getItem(`${removedListStorageKey}`);
    if (!removedArbeidsforhold) {
      localStorage.setItem(`${removedListStorageKey}`, JSON.stringify([]));
    }

    const removedArbeidsforholdList = removedArbeidsforhold
      ? JSON.parse(removedArbeidsforhold)
      : [];

    // Filter arbeidsforhold from aareg with localStorage arbeisforhold removed list
    const filteredArbeidsforhold = arbeidsforhold.filter(
      (forhold) => !removedArbeidsforholdList.includes(forhold.id),
    );

    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }

  function initLocalStorageAAREGArbeidsforholdFilledList() {
    // Init arbeidsforhold removed list to localStorage
    const filledListStorageKey = `aareg-filled-list-${router?.query?.uuid}`;
    const filledArbeidsforhold = localStorage?.getItem(`${filledListStorageKey}`);
    if (!filledArbeidsforhold) {
      localStorage.setItem(`${filledListStorageKey}`, JSON.stringify([]));
    }

    const filledArbeidsforholdList = filledArbeidsforhold ? JSON.parse(filledArbeidsforhold) : [];

    // Set filled list from localStorage to local state
    setFilledArbeidsforhold(filledArbeidsforholdList);
  }

  function initLocalStorageAAREGArbeidsforholdFinishedList() {
    // Init arbeidsforhold finished list to localStorage
    const finishedListStorageKey = `aareg-finished-list-${router?.query?.uuid}`;
    const finishedArbeidsforhold = localStorage?.getItem(`${finishedListStorageKey}`);
    if (!finishedArbeidsforhold) {
      localStorage.setItem(`${finishedListStorageKey}`, JSON.stringify([]));
    }

    const finishedArbeidsforholdList = finishedArbeidsforhold
      ? JSON.parse(finishedArbeidsforhold)
      : [];

    // Set finished list from localStorage to local state
    setFinishedArbeidsforhold(finishedArbeidsforholdList);
  }

  function addArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }
    setContextSelectedArbeidsforhold(selectedArbeidsforhold);

    const filletListStorageKey = `aareg-filled-list-${router?.query?.uuid}`;
    const filledArbeidsforhold = localStorage?.getItem(`${filletListStorageKey}`);
    const filledArbeidsforholdList: string[] = filledArbeidsforhold
      ? JSON.parse(filledArbeidsforhold)
      : [];

    if (filledArbeidsforhold && !filledArbeidsforhold.includes(selectedArbeidsforhold.id)) {
      filledArbeidsforholdList.push(selectedArbeidsforhold.id);
      localStorage.setItem(`${filletListStorageKey}`, JSON.stringify(filledArbeidsforholdList));
      setFilledArbeidsforhold(filledArbeidsforholdList);
    }
  }

  function removeArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const removedListStorageKey = `aareg-removed-list-${router?.query?.uuid}`;
    const removedArbeidsforhold = localStorage?.getItem(`${removedListStorageKey}`);
    const removedArbeidsforholdList: string[] = removedArbeidsforhold
      ? JSON.parse(removedArbeidsforhold)
      : [];

    removedArbeidsforholdList.push(selectedArbeidsforhold.id);
    localStorage.setItem(`${removedListStorageKey}`, JSON.stringify(removedArbeidsforholdList));

    const filteredArbeidsforhold = [...arbeidsforhold].filter(
      (forhold) => !removedArbeidsforholdList.includes(forhold.id),
    );

    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }

  return (
    <div className={styles.accordion}>
      <Accordion>
        {accordionArbeidsforhold?.map((arbeidsforhold, index) => {
          const { id, organisasjonsnavn, startdato, sluttdato } = arbeidsforhold;
          const editing = filledArbeidsforhold.includes(id) && hasUnansweredFaktumId;
          const finished = finishedArbeidsforhold.includes(id);

          return (
            <Accordion.Item key={id} defaultOpen={index === 0}>
              <Accordion.Header className="arbeidsforhold__accordion">
                <div>{organisasjonsnavn}</div>
                <div className={styles.iconContainer}>
                  {finished && !editing && <CheckmarkIcon />}
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
