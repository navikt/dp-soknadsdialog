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
  const [arbeidsforholdList, setArbeidsforholdList] = useState<IArbeidsforhold[]>([]);

  useEffect(() => {
    // use UUID without dashes as localstorage key
    const storageKey = router?.query?.uuid?.toString().replace(/-/g, "");
    const storageRemovedArbeidsforhold = localStorage?.getItem(`${storageKey}`);

    // parse stored removed arbeidsforhold as array
    const storageRemovedArbeidsforholdArray = storageRemovedArbeidsforhold
      ? JSON.parse(storageRemovedArbeidsforhold)
      : [];

    // filter AAREG list with localStorage list
    const initialArbeidsforholdList = arbeidsforhold.filter(
      (forhold) => !storageRemovedArbeidsforholdArray.includes(forhold.id),
    );

    setArbeidsforholdList(initialArbeidsforholdList);
  }, [arbeidsforholdList]);

  function removeArbeidsforhold(selectedArbeidsforhold: IArbeidsforhold) {
    const storageKey = router?.query?.uuid?.toString().replace(/-/g, "");
    const storageRemovedArbeidsforhold = localStorage?.getItem(`${storageKey}`);

    // Init storage with key
    if (!storageRemovedArbeidsforhold) {
      localStorage.setItem(`${storageKey}`, JSON.stringify([`${selectedArbeidsforhold.id}`]));
    }

    if (storageRemovedArbeidsforhold) {
      const removedList = JSON.parse(storageRemovedArbeidsforhold);
      removedList.push(selectedArbeidsforhold.id);

      localStorage.setItem(`${storageKey}`, JSON.stringify(removedList));
    }

    // Remove arbeidsforhold from the list
    const newArbeidsforholdList = [...arbeidsforhold].filter(
      (forhold) => forhold.id !== selectedArbeidsforhold.id,
    );

    setArbeidsforholdList(newArbeidsforholdList);
  }

  return (
    <div className={styles.accordion}>
      <Accordion>
        {arbeidsforholdList?.map((arbeidsforhold) => {
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
