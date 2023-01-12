import { BodyShort, Heading, ReadMore, Tag } from "@navikt/ds-react";
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
import styles from "./ReceiptDokumentkrav.module.css";
import { PdfView } from "../../views/pdf/Pdf";
import React from "react";

interface IProps {
  dokumentkrav: IDokumentkrav;
  pdfView?: PdfView;
}

export function ReceiptDokumentkravMissingItem(props: IProps) {
  const { dokumentkrav, pdfView } = props;
  const { getAppText, getDokumentkravTextById } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <li className="my-6">
      <div className={styles.dokumentkravTitle}>
        <Heading level="3" size="xsmall">
          {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
        </Heading>

        {!pdfView && (
          <Tag variant="warning" className={styles.dokumentkravTag}>
            {getAppText("kvittering.dokumenter.status.mangler")}
          </Tag>
        )}
      </div>

      {dokumentkravText?.description && pdfView === "brutto" && (
        <PortableText value={dokumentkravText.description} />
      )}

      <BodyShort>
        <>
          {pdfView && <strong>{getAppText("pdf.faktum.svar")}</strong>}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
            <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_ANDRE)}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
            <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_DEG)}</>
          )}
        </>
      </BodyShort>

      {pdfView && (
        <BodyShort>
          <strong>{getAppText("pdf.begrunnelse")}</strong> {dokumentkrav.begrunnelse}
        </BodyShort>
      )}

      {dokumentkravText?.helpText && pdfView !== "netto" && (
        <ReadMore header={dokumentkravText?.helpText?.title}>
          {dokumentkravText?.helpText?.body && (
            <PortableText value={dokumentkravText.helpText.body} />
          )}
        </ReadMore>
      )}
    </li>
  );
}
