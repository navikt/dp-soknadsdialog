import { BodyLong, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import styles from "./ReceiptSoknadTilstand.module.css";

export function ReceiptSoknadTilstand(props: ISoknadStatus) {
  const { getAppTekst } = useSanity();
  return (
    <>
      <div className={styles.receiptSoknadTilstandHeader}>
        <Heading level="2" size="medium">
          Status på søknad
        </Heading>
        <Tag variant="success">{props.tilstand}</Tag>
      </div>
      <BodyLong className={styles.receiptSoknadTilstandDescription}>
        {getAppTekst("kvittering.arbeidsokerstatus.info-tekst")}
      </BodyLong>
    </>
  );
}
