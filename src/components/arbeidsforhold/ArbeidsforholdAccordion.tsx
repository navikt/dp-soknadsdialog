import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold, useUserInformation } from "../../context/user-information-context";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum, IQuizSeksjon } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import styles from "./Arbeidsforhold.module.css";
import { CheckmarkIcon } from "./arbeidsforhold-v2/CheckmarkIcon";
import { WarningIcon } from "./arbeidsforhold-v2/WarningIcon";
import { useState } from "react";
import { getUnansweredFaktumId } from "../faktum/validation/validations.utils";
import { useValidation } from "../../context/validation-context";

interface IProps {
  faktum: IQuizGeneratorFaktum;
  currentSection: IQuizSeksjon;
}

export function ArbeidsforholdAccordion({ faktum, currentSection }: IProps) {
  const [disabled, setDisabled] = useState(false);
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const { setUnansweredFaktumId } = useValidation();
  const { arbeidsforhold, setContextSelectedArbeidsforhold, updateContextArbeidsforhold } =
    useUserInformation();

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

  return (
    <div className={styles.accordion}>
      <Accordion>
        {arbeidsforhold?.map((arbeidsforhold, index) => (
          <Accordion.Item key={arbeidsforhold.id} defaultOpen={index === 0}>
            <Accordion.Header className="arbeidsforhold__accordion">
              <div>{arbeidsforhold.organisasjonsnavn}</div>
              <div className={styles.iconContainer}>
                {arbeidsforhold.utfyllingStatus === "fullført" && <CheckmarkIcon />}
                {arbeidsforhold.utfyllingStatus === "påbegynt" && <WarningIcon />}
              </div>
            </Accordion.Header>
            <Accordion.Content>
              <>
                <FormattedDate date={arbeidsforhold.startdato} /> -{" "}
                {arbeidsforhold.sluttdato && <FormattedDate date={arbeidsforhold.sluttdato} />}
              </>
              <div className={styles.buttonContainer}>
                <Button
                  icon={<PencilIcon fontSize="1.5rem" />}
                  onClick={() => addArbeidsforhold(arbeidsforhold)}
                  disabled={disabled && arbeidsforhold.utfyllingStatus !== "påbegynt"}
                >
                  Fyll ut
                </Button>
                <Button
                  variant="secondary"
                  icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
                >
                  Fjern
                </Button>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
