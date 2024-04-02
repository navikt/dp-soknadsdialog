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
import { useArbeidsforholdLocalStorage } from "../../hooks/useArbeidsforholdLocalStorage";

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
  const [aaregArbeidsforhold, setAaregArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const [filledArbeidsforhold, setFilledArbeidsforhold] = useState<string[]>([]);
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
      const finishedArbeidsforhold = getStorageArrayByKey(finishedListStorageKey);

      finishedArbeidsforhold.push(contextSelectedArbeidsforhold.id);
      localStorage.setItem(finishedListStorageKey, JSON.stringify(finishedArbeidsforhold));
      setFinishedArbeidsforhold(finishedArbeidsforhold);
    }
  }, [dinSituasjonSection]);

  useEffect(() => {
    const filledArbeidsforhold = getStorageArrayByKey(startedListStorageKey);
    setFilledArbeidsforhold(filledArbeidsforhold);

    const finishedArbeidsforhold = getStorageArrayByKey(finishedListStorageKey);
    setFinishedArbeidsforhold(finishedArbeidsforhold);

    const removedArbeidsforhold = getStorageArrayByKey(removedListStorageKey);
    const filteredArbeidsforhold = arbeidsforhold.filter(
      (forhold) => !removedArbeidsforhold.includes(forhold.id),
    );
    setAaregArbeidsforhold(filteredArbeidsforhold);
  }, []);

  function addArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }
    setContextSelectedArbeidsforhold(selectedArbeidsforhold);

    const filledArbeidsforhold = getStorageArrayByKey(startedListStorageKey);

    if (filledArbeidsforhold && !filledArbeidsforhold.includes(selectedArbeidsforhold.id)) {
      filledArbeidsforhold.push(selectedArbeidsforhold.id);
      localStorage.setItem(startedListStorageKey, JSON.stringify(filledArbeidsforhold));
      setFilledArbeidsforhold(filledArbeidsforhold);
    }
  }

  function removeArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const removedArbeidsforhold = getStorageArrayByKey(removedListStorageKey);
    removedArbeidsforhold.push(selectedArbeidsforhold.id);
    localStorage.setItem(removedListStorageKey, JSON.stringify(removedArbeidsforhold));

    const filteredArbeidsforhold = [...arbeidsforhold].filter(
      (forhold) => !removedArbeidsforhold.includes(forhold.id),
    );

    setAaregArbeidsforhold(filteredArbeidsforhold);
  }

  return (
    <div className={styles.accordion}>
      <Accordion>
        {aaregArbeidsforhold?.map((arbeidsforhold, index) => {
          const { id, organisasjonsnavn, startdato, sluttdato } = arbeidsforhold;
          const editing = filledArbeidsforhold.includes(id) && hasUnansweredFaktumId;
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
