import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold, useUserInformation } from "../../context/user-information-context";
import { useGeneratorUtils } from "../../hooks/useGeneratorUtils";
import { IQuizGeneratorFaktum } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import styles from "./Arbeidsforhold.module.css";
import { CheckmarkIcon } from "./arbeidsforhold-v2/CheckmarkIcon";

interface IProps {
  faktum: IQuizGeneratorFaktum;
  arbeidsforhold: IArbeidsforhold[];
}

export function ArbeidsforholdAccordion({ arbeidsforhold, faktum }: IProps) {
  const { addNewGeneratorAnswer } = useGeneratorUtils();
  const { setContextSelectedArbeidsforhold } = useUserInformation();

  function addArbeidsforhold(arbeidsforhold: IArbeidsforhold) {
    addNewGeneratorAnswer(faktum);
    setContextSelectedArbeidsforhold(arbeidsforhold);
  }

  // Dette er status til et arbeidsforhold, om det er ferdig eller delvis utført.
  // Her bør vi bygge et struktur som lever i context
  const status = true;
  return (
    <div className={styles.accordion}>
      <Accordion>
        {arbeidsforhold?.map((arbeidsforhold, index) => (
          <Accordion.Item key={arbeidsforhold.id} defaultOpen={index === 0}>
            <Accordion.Header className="arbeidsforhold__accordion">
              <div>{arbeidsforhold.organisasjonsnavn}</div>
              <div
                className={styles.iconContainer}
                aria-label={status ? "Ferdig utfylt" : "Delvis utfylt"}
              >
                <CheckmarkIcon />
              </div>
            </Accordion.Header>
            <Accordion.Content>
              <>
                <FormattedDate date={arbeidsforhold.startdato} /> -{" "}
                {arbeidsforhold.sluttdato && <FormattedDate date={arbeidsforhold.sluttdato} />}
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
