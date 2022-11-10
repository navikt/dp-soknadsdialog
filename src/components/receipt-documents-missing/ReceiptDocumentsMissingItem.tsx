import { BodyShort, Heading, ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import {
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../../constants";
import { useSanity } from "../../context/sanity-context";
import {
  DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_ANDRE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_DEG,
} from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import styles from "./ReceiptDocumentsMissing.module.css";

export function ReceiptDocumentsMissingItem(dokumentkrav: IDokumentkrav) {
  const { getAppText, getDokumentkravTextById } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <div className={styles.dokumentkrav}>
      <Heading level="3" size="xsmall">
        {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
      </Heading>
      <BodyShort>
        <>
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
            <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_ANDRE)}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
            <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_DEG)}</>
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
    </div>
  );
}
