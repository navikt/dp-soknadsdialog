import { Accordion, BodyLong, Button, ReadMore } from "@navikt/ds-react";
import { IArbeidsforhold } from "../../context/user-information-context";
import { FormattedDate } from "../FormattedDate";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { useSanity } from "../../context/sanity-context";
import styles from "./Arbeidsforhold.module.css";

interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export function ArbeidsforholdAccordion({ arbeidsforhold }: IProps) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.accordion}>
      {arbeidsforhold.length > 0 && (
        <>
          <BodyLong className={styles.description}>
            Fyll ut opplysninger om arbeidsforholdene dine. Hvis du mener at et arbeidsforhold ikke
            er relevant for søknaden kan du fjerne det fra denne listen.
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
      <Accordion>
        {arbeidsforhold?.map(({ id, organisasjonsnavn, startdato, sluttdato }) => (
          <Accordion.Item key={id}>
            <Accordion.Header className="arbeidsforhold__accordion">
              <div>{organisasjonsnavn}</div>
              <div>x</div>
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
