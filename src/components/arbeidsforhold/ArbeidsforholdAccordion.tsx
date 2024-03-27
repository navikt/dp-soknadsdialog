import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold, useUserInformation } from "../../context/user-information-context";
import { FormattedDate } from "../FormattedDate";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Arbeidsforhold.module.css";

export function ArbeidsforholdAccordion() {
  const router = useRouter();
  const { arbeidsforhold } = useUserInformation();
  const [accordionArbeidsforhold, setAccordionArbeidsforhold] = useState<IArbeidsforhold[]>([]);

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
          const { id, organisasjonsnavn, startdato, sluttdato } = arbeidsforhold;

          return (
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
