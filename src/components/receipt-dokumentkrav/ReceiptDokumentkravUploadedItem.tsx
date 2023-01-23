import { BodyShort, Heading, Link, ReadMore, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import api from "../../api.utils";
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

export function ReceiptDokumentkravUploadedItem({ dokumentkrav, pdfView }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
  const answerText = getDokumentkravSvarText(dokumentkrav);

  return (
    <li className="my-6">
      <div className={styles.dokumentkravTitle}>
        {pdfView && (
          <Heading level="3" size="xsmall">
            <DokumentkravTitle dokumentkrav={dokumentkrav} />
          </Heading>
        )}

        {!pdfView && (
          <>
            <Link
              href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
              rel="noreferrer"
              target="_blank"
            >
              <Heading level="3" size="xsmall">
                <DokumentkravTitle dokumentkrav={dokumentkrav} />
              </Heading>
            </Link>

            <Tag variant="success" className={styles.dokumentkravTag}>
              {getAppText("kvittering.dokumenter.status.mottatt")}
            </Tag>
          </>
        )}
      </div>

      {dokumentkravText?.description && pdfView === "brutto" && (
        <PortableText value={dokumentkravText.description} />
      )}

      <BodyShort>
        {pdfView && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {answerText && getAppText(answerText)}
      </BodyShort>

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
