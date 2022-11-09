import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { IDokumentkrav } from "../../types/documentation.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import { ReceiptDocumentsMissing } from "../../components/receipt-documents-missing/ReceiptDocumentsMissing";
import { ReceiptSoknadStatus } from "../../components/receipt-soknad-status/ReceiptSoknadStatus";
import { ArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { ReceiptDocumentsNotSending } from "../../components/receipt-documents-not-sending/ReceiptDocumentsNotSending";
import { ReceiptDocumentsUploaded } from "../../components/receipt-documents-uploaded/ReceiptDocumentsUploaded";
import { ReceiptDocumentsOther } from "../../components/receipt-documents-other/ReceiptDocumentsOther";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import styles from "./Receipts.module.css";
import { PageMeta } from "../../components/PageMeta";
import { PortableText } from "@portabletext/react";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";

interface IProps {
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
}

export function Receipt(props: IProps) {
  const { getAppText, getInfosideText } = useSanity();
  const { dokumentkravList } = useDokumentkrav();
  const dokumentasjonsText = getInfosideText("kvittering.dokumentasjon");

  const missingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE
  );

  const uploadedDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) => dokumentkrav.bundle
  );

  const notSendingDocuments: IDokumentkrav[] = dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  );

  function navigateToMineDagpener() {
    window.location.assign("https://arbeid.dev.nav.no/arbeid/dagpenger/mine-dagpenger");
  }

  return (
    <main>
      <PageMeta
        title={getAppText("kvittering.side-metadata.tittel")}
        description={getAppText("kvittering.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <ReceiptSoknadStatus {...props.soknadStatus} />
      <ArbeidssokerStatus status={props.arbeidssokerStatus} />

      {dokumentasjonsText && (
        <div className={styles.dokumentasjonsTextContainer}>
          <PortableText value={dokumentasjonsText.body} />
        </div>
      )}

      <div className={styles.documentList}>
        {missingDocuments.length > 0 && <ReceiptDocumentsMissing documents={missingDocuments} />}
        <ReceiptDocumentsOther />
        {uploadedDocuments.length > 0 && <ReceiptDocumentsUploaded documents={uploadedDocuments} />}
        {notSendingDocuments.length > 0 && (
          <ReceiptDocumentsNotSending documents={notSendingDocuments} />
        )}
      </div>
      <ReceiptYourAnswers sections={props.sections} />
      <Button
        variant="primary"
        className={styles.nagivateToMineDagpengerButton}
        onClick={navigateToMineDagpener}
      >
        {getAppText("kvittering.mine-dagpenger.knapp")}
      </Button>
      <NoSessionModal />
    </main>
  );
}
