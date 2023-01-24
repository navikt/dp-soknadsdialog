import React from "react";
import { BodyShort, Heading, ReadMore } from "@navikt/ds-react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { PdfView } from "../../views/pdf/Pdf";
import { PortableText } from "@portabletext/react";
import { DokumentkravTitle } from "../dokumentkrav/DokumentkravTitle";
import { DokumentkravSvar } from "../dokumentkrav-svar/DokumentkravSvar";

interface IProps {
  dokumentkrav: IDokumentkrav;
  pdfView?: PdfView;
}

export function ReceiptDocumentsNotSendingItem({ dokumentkrav, pdfView }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <li className="my-6">
      <Heading level="3" size="xsmall">
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
      </Heading>

      {dokumentkravText?.description && pdfView === "brutto" && (
        <PortableText value={dokumentkravText.description} />
      )}

      <BodyShort>
        {pdfView && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        <DokumentkravSvar dokumentkrav={dokumentkrav} />
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
