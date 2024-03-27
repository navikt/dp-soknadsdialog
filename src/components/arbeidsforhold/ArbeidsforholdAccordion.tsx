import { CheckmarkIcon, PencilIcon, TrashIcon } from "@navikt/aksel-icons";
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

interface IProps {
  faktum: IQuizGeneratorFaktum;
  currentSection: IQuizSeksjon;
}

export function ArbeidsforholdAccordion({ faktum, currentSection }: IProps) {
  const router = useRouter();
  const [accordionArbeidsforhold, setAccordionArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const [disabled, setDisabled] = useState(false);
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const { setUnansweredFaktumId } = useValidation();
  const { getAppText } = useSanity();
  const { arbeidsforhold, setContextSelectedArbeidsforhold, updateContextArbeidsforhold } =
    useUserInformation();

  useEffect(() => {
    const storageKey = router?.query?.uuid;
    const removedArbeidsforhold = localStorage?.getItem(`${storageKey}`);

    if (!removedArbeidsforhold) {
      localStorage.setItem(`${storageKey}`, JSON.stringify([]));
    }

    const removedArbeidsforholdList = removedArbeidsforhold
      ? JSON.parse(removedArbeidsforhold)
      : [];

    const filteredArbeidsforhold = arbeidsforhold.filter(
      (forhold) => !removedArbeidsforholdList.includes(forhold.id),
    );

    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }, []);

  function addArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const hasUnansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);

    if (faktum?.svar && hasUnansweredFaktumId) {
      setUnansweredFaktumId(hasUnansweredFaktumId);
    } else {
      addNewGeneratorAnswer(faktum);
    }

    setDisabled(true);
    setContextSelectedArbeidsforhold(selectedArbeidsforhold);

    const arbeidsforholdWithStatus: IArbeidsforhold[] = [...arbeidsforhold].map((forhold) =>
      forhold.id === selectedArbeidsforhold.id
        ? { ...forhold, utfyllingStatus: "påbegynt" }
        : forhold,
    );

    updateContextArbeidsforhold(arbeidsforholdWithStatus);
  }

  function removeArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const storageKey = router?.query?.uuid;
    const removedArbeidsforhold = localStorage?.getItem(`${storageKey}`);
    const removedArbeidsforholdList: string[] = removedArbeidsforhold
      ? JSON.parse(removedArbeidsforhold)
      : [];

    removedArbeidsforholdList.push(selectedArbeidsforhold.id);
    localStorage.setItem(`${storageKey}`, JSON.stringify(removedArbeidsforholdList));
    const filteredArbeidsforhold = [...arbeidsforhold].filter(
      (forhold) => !removedArbeidsforholdList.includes(forhold.id),
    );

    setAccordionArbeidsforhold(filteredArbeidsforhold);
  }

  return (
    <div className={styles.accordion}>
      <Accordion>
        {accordionArbeidsforhold?.map((arbeidsforhold) => {
          const { id, organisasjonsnavn, startdato, sluttdato, utfyllingStatus } = arbeidsforhold;
          const fullfort = utfyllingStatus === "fullført";
          const paabegynt = utfyllingStatus === "påbegynt";

          return (
            <Accordion.Item key={id}>
              <Accordion.Header className="arbeidsforhold__accordion">
                <div>{organisasjonsnavn}</div>
                <div className={styles.iconContainer}>
                  {fullfort && <CheckmarkIcon />}
                  {paabegynt && <WarningColored />}
                </div>
              </Accordion.Header>
              <Accordion.Content>
                <>
                  <FormattedDate date={startdato} /> -{" "}
                  {sluttdato && <FormattedDate date={sluttdato} />}
                  {paabegynt && (
                    <Detail uppercase>
                      <WarningColored />
                      {getAppText("generator-faktum-kort.delvis-utfylt.varsel")}
                    </Detail>
                  )}
                </>
                <div className={styles.buttonContainer}>
                  <Button
                    icon={<PencilIcon fontSize="1.5rem" />}
                    onClick={() => addArbeidsforhold(arbeidsforhold)}
                    disabled={disabled && paabegynt}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <Button icon={<PencilIcon title="a11y-title" fontSize="1.5rem" />}>
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
