import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { IMineSoknader } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import styles from "./inngangSendDocument.module.css";

export function InngangSendDocument(props: IMineSoknader) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.inngangSendDocumentContainer}>
      <BodyLong>{getAppText("inngang.send-dokument.beskrivelse")}</BodyLong>
      {props.innsendte?.map((soknad) => {
        return (
          <Link
            href={`/soknad/${soknad.soknadUuid}/kvittering`}
            passHref
            key={soknad.soknadUuid}
            legacyBehavior
          >
            <Button variant="secondary" as="a">
              {getAppText("inngang.send-dokument.knapp-tekst")}{" "}
              <FormattedDate date={soknad.forstInnsendt} short />
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
