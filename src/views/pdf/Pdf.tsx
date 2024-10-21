import { Heading } from "@navikt/ds-react";
import { PageMeta } from "../../components/PageMeta";
import { Personalia } from "../../components/personalia/Personalia";
import { ReceiptDocumentsNotSendingItem } from "../../components/receipt-documents-not-sending/ReceiptDocumentsNotSendingItem";
import { ReceiptDokumentkravMissingItem } from "../../components/receipt-dokumentkrav/ReceiptDokumentkravMissingItem";
import { ReceiptDokumentkravUploadedItem } from "../../components/receipt-dokumentkrav/ReceiptDokumentkravUploadedItem";
import { SectionQuiz } from "../../components/section/SectionQuiz";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav, IDokumentkravList } from "../../types/documentation.types";
import { IPersonalia } from "../../types/personalia.types";
import {
  getMissingDokumentkrav,
  getNotSendingDokumentkrav,
  getUploadedDokumentkrav,
} from "../../utils/dokumentkrav.util";
import styles from "./Pdf.module.css";

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

  const missingDocuments: IDokumentkrav[] = getMissingDokumentkrav(dokumentkravList);
  const uploadedDocuments: IDokumentkrav[] = getUploadedDokumentkrav(dokumentkravList);
  const notSendingDocuments: IDokumentkrav[] = getNotSendingDokumentkrav(dokumentkravList);

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
            <SectionQuiz
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
