import { BodyLong, Button } from "@navikt/ds-react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { IMineSoknader } from "../../types/quiz.types";
import styles from "./inngangSendDocument.module.css";

export function InngangSendDocument({ innsendte }: IMineSoknader) {
  const { getAppText } = useSanity();
  return (
    <div className={styles.inngangSendDocumentContainer}>
      <BodyLong>{getAppText("inngang.send-dokument.beskrivelse")}</BodyLong>
      {innsendte?.map((soknad) => {
        return (
          <Link href={`/${soknad.soknadUuid}/kvittering`} passHref key={soknad.soknadUuid}>
            <Button variant="secondary" as="a">
              {getAppText("inngang.send-dokument.knapp-tekst")}{" "}
              {format(parseISO(soknad.forstInnsendt), "dd.MM.yyyy")}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
