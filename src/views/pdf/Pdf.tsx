import React from "react";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { useSanity } from "../../context/sanity-context";
import { useQuiz } from "../../context/quiz-context";
import { Personalia } from "../../components/personalia/Personalia";
import { IPersonalia } from "../../types/personalia.types";
import { IDokumentkrav, IDokumentkravList } from "../../types/documentation.types";
import { ReceiptDokumentkravUploadedItem } from "../../components/receipt-dokumentkrav/ReceiptDokumentkravUploadedItem";
import { Heading } from "@navikt/ds-react";
import styles from "./Pdf.module.css";
import {
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import { ReceiptDokumentkravMissingItem } from "../../components/receipt-dokumentkrav/ReceiptDokumentkravMissingItem";
import { ReceiptDocumentsNotSendingItem } from "../../components/receipt-documents-not-sending/ReceiptDocumentsNotSendingItem";

interface IProps {
  personalia: IPersonalia;
  dokumentkravList: IDokumentkravList;
  pdfView: PdfView;
}

export type PdfView = "netto" | "brutto";

export function Pdf(props: IProps) {
  const { personalia, dokumentkravList, pdfView } = props;
  const { getAppText } = useSanity();
  const { soknadState } = useQuiz();

  const missingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE ||
      (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !dokumentkrav.bundleFilsti)
  );

  const uploadedDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) => dokumentkrav.bundleFilsti
  );

  const notSendingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  );

  return (
    <>
      <PageMeta
        title={getAppText("soknad.side-metadata.tittel")}
        description={getAppText("soknad.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <main>
        <Personalia personalia={personalia} />

        {soknadState.seksjoner.map((section) => (
          <div key={section.beskrivendeId} className="my-11">
            <Section
              key={section.beskrivendeId}
              section={section}
              readonly={true}
              showAllTexts={pdfView === "brutto"}
            />
          </div>
        ))}

        <div className={styles.dokumentkrav}>
          <Heading spacing size="large" level="2">
            Dokumentkrav
          </Heading>

          <ol className={styles.dokumentkravList}>
            {missingDocuments.map((dokumentkrav) => (
              <ReceiptDokumentkravMissingItem
                key={dokumentkrav.beskrivendeId}
                dokumentkrav={dokumentkrav}
                pdfView={pdfView}
              />
            ))}

            {uploadedDocuments.map((dokumentkrav) => (
              <ReceiptDokumentkravUploadedItem
                key={dokumentkrav.beskrivendeId}
                dokumentkrav={dokumentkrav}
                pdfView={pdfView}
              />
            ))}

            {notSendingDocuments.map((dokumentkrav) => (
              <ReceiptDocumentsNotSendingItem
                key={dokumentkrav.beskrivendeId}
                dokumentkrav={dokumentkrav}
                pdfView={pdfView}
              />
            ))}
          </ol>
        </div>
      </main>
    </>
  );
}
