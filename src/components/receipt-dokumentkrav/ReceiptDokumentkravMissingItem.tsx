import { BodyShort, Heading, ReadMore, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav } from "../../types/documentation.types";
import styles from "./ReceiptDokumentkrav.module.css";
import { PdfView } from "../../views/pdf/Pdf";
import React from "react";
import { DokumentkravTitle } from "../dokumentkrav/DokumentkravTitle";
import { getDokumentkravSvarText } from "../../dokumentkrav.util";

interface IProps {
  dokumentkrav: IDokumentkrav;
  pdfView?: PdfView;
}

export function ReceiptDokumentkravMissingItem(props: IProps) {
  const { dokumentkrav, pdfView } = props;
  const { getAppText, getDokumentkravTextById } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
  const answerText = getDokumentkravSvarText(dokumentkrav);

  return (
    <li className="my-6">
      <div className={styles.dokumentkravTitle}>
        <Heading level="3" size="xsmall">
          <DokumentkravTitle dokumentkrav={dokumentkrav} />
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
        {pdfView && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {answerText && getAppText(answerText)}
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
