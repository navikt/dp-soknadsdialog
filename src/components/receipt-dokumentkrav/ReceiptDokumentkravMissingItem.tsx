import { BodyShort, Heading, ReadMore, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import {
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../../constants";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav } from "../../types/documentation.types";
import styles from "./ReceiptDokumentkrav.module.css";

export function ReceiptDokumentkravMissingItem(dokumentkrav: IDokumentkrav) {
  const { getAppText, getDokumentkravTextById } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <li className="my-6">
      <div className={styles.dokumentkravTitle}>
        <Heading level="3" size="xsmall">
          {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
        </Heading>
        <Tag variant="warning" className={styles.dokumentkravTag}>
          {getAppText("kvittering.dokumenter.status.mangler")}
        </Tag>
      </div>
      <BodyShort>
        <>
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
            <>{getAppText("dokumentkrav.begrunnelse.sendes-av-andre")}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
            <>{getAppText("dokumentkrav.begrunnelse.sendes-av-deg")}</>
          )}
        </>
      </BodyShort>

      {dokumentkravText?.helpText && (
        <ReadMore header={dokumentkravText?.helpText?.title}>
          {dokumentkravText?.helpText?.body && (
            <PortableText value={dokumentkravText.helpText.body} />
          )}
        </ReadMore>
      )}
    </li>
  );
}
