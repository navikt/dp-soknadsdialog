import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold } from "../../context/user-information-context";
import { FormattedDate } from "../FormattedDate";
import styles from "./Arbeidsforhold.module.css";
import { CheckmarkIcon } from "./arbeidsforhold-v2/CheckmarkIcon";

interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export function ArbeidsforholdAccordion({ arbeidsforhold }: IProps) {
  const status = true;
  return (
    <div className={styles.accordion}>
      <Accordion>
        {arbeidsforhold?.map(({ id, organisasjonsnavn, startdato, sluttdato }, index) => (
          <Accordion.Item key={id} defaultOpen={index === 0}>
            <Accordion.Header className="arbeidsforhold__accordion">
              <div>{organisasjonsnavn}</div>
              <div
                className={styles.iconContainer}
                aria-label={status ? "Ferdig utfylt" : "Delvis utfylt"}
              >
                <CheckmarkIcon />
              </div>
            </Accordion.Header>
            <Accordion.Content>
              <>
                <FormattedDate date={startdato} /> -{" "}
                {sluttdato && <FormattedDate date={sluttdato} />}
              </>
              <div className={styles.buttonContainer}>
                <Button icon={<PencilIcon title="a11y-title" fontSize="1.5rem" />}>Fyll ut</Button>
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
