import { BodyLong, Button } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { ICombinedInnsendtSoknad } from "../../views/inngang/Inngang";
import { FormattedDate } from "../FormattedDate";
import styles from "./inngangSendDocument.module.css";

interface IProps {
  innsendte?: ICombinedInnsendtSoknad[];
  brukerdialogUrl: string;
}

export function InngangSendDocument({ innsendte, brukerdialogUrl }: IProps) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.inngangSendDocumentContainer}>
      <BodyLong>{getAppText("inngang.send-dokument.beskrivelse")}</BodyLong>

      {innsendte?.map((soknad) => {
        return (
          <Link
            href={
              soknad.isOrkestratorSoknad
                ? `${brukerdialogUrl}/${soknad.soknadUuid}/kvittering`
                : `/soknad/${soknad.soknadUuid}/kvittering`
            }
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
