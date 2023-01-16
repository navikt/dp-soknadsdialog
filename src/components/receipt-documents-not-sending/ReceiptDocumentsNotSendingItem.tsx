import React from "react";
import { BodyShort, Heading, ReadMore } from "@navikt/ds-react";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { PdfView } from "../../views/pdf/Pdf";
import { PortableText } from "@portabletext/react";

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
        {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
      </Heading>

      {dokumentkravText?.description && pdfView === "brutto" && (
        <PortableText value={dokumentkravText.description} />
      )}

      <BodyShort>
        <>
          {pdfView && <strong>{getAppText("pdf.faktum.svar")}</strong>}

          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE && (
            <>{getAppText("dokumentkrav.begrunnelse.sendt-tidligere")}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
            <>{getAppText("dokumentkrav.begrunnelse.sender-ikke")}</>
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
