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

interface IProps {
  faktum: IQuizGeneratorFaktum;
  currentSection: IQuizSeksjon;
}

export function ArbeidsforholdAccordion({ faktum, currentSection }: IProps) {
  const router = useRouter();
  const [accordionArbeidsforhold, setAccordionArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const { setUnansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();

  const { arbeidsforhold, setContextSelectedArbeidsforhold } = useUserInformation();

  const hasUnansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);

  useEffect(() => {
    // Init arbeidsforhold removed list on localStorage
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

    // Update arbeidsforhold accordion with filtered data
    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }, []);

  function addArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }

    setContextSelectedArbeidsforhold(selectedArbeidsforhold);
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

          return (
            <Accordion.Item key={id} defaultOpen={index === 0}>
              <Accordion.Header className="arbeidsforhold__accordion">
                <div>{organisasjonsnavn}</div>
                <div className={styles.iconContainer}>
                  {true && <CheckmarkIcon />}
                  {false && <WarningColored />}
                </div>
              </Accordion.Header>
              <Accordion.Content>
                <>
                  <FormattedDate date={startdato} /> -{" "}
                  {sluttdato && <FormattedDate date={sluttdato} />}
                  {false && (
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
