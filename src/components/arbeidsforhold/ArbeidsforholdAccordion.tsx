import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold } from "../../context/user-information-context";
import { FormattedDate } from "../FormattedDate";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import styles from "./Arbeidsforhold.module.css";

interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export function ArbeidsforholdAccordion({ arbeidsforhold }: IProps) {
  return (
    <Accordion>
      {arbeidsforhold?.map(({ id, organisasjonsnavn, startdato, sluttdato }) => (
        <Accordion.Item key={id}>
          <Accordion.Header>
            <div className={styles.arbeidsforholdAccordionHeader}>
              <div>{organisasjonsnavn}</div>
              <div>x</div>
            </div>
          </Accordion.Header>
          <Accordion.Content>
            <>
              <FormattedDate date={startdato} /> - {sluttdato && <FormattedDate date={sluttdato} />}
            </>
            <div className={styles.arbeidsforholdAccordionButtonContainer}>
              <Button icon={<PencilIcon title="a11y-title" fontSize="1.5rem" />}>Fyll ut</Button>
              <Button variant="secondary" icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}>
                Fjern
              </Button>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
