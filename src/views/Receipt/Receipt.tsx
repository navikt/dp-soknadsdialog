import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { IDokumentkrav, IDokumentkravList } from "../../types/documentation.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import { ReceiptDocumentsMissing } from "../../components/receipt-documents-missing/ReceiptDocumentsMissing";
import { ReceiptSoknadTilstand } from "../../components/receipt-soknad-tilstand/ReceiptSoknadTilstand";
import { ArbeidssokerStatus } from "../../components/receipt-arbeidssoker-status/ReceiptArbeidssokerStatus";
import { ReceiptDocumentsNotSending } from "../../components/receipt-documents-not-sending/ReceiptDocumentsNotSending";
import { ReceiptDocumentsUploaded } from "../../components/receipt-documents-uploaded/ReceiptDocumentsUploaded";
import { ReceiptDocumentsOther } from "../../components/receipt-documents-other/ReceiptDocumentsOther";
import styles from "./Receipts.module.css";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ReceiptYourAnswers } from "../../components/receipt-your-answers/ReceiptYourAnswers";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  soknadStatus: ISoknadStatus;
  dokumentkravList: IDokumentkravList;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
}

export function Receipt(props: IProps) {
  const { getAppTekst } = useSanity();

  const missingDocuments: IDokumentkrav[] = props.dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE
  );
  const uploadedDocuments: IDokumentkrav[] = props.dokumentkravList.krav.filter(
    (dokumentkrav) => dokumentkrav.bundle
  );

  const notSendingDocuments: IDokumentkrav[] = props.dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  );

  function navigateToMineDagpener() {
    window.location.assign("https://arbeid.dev.nav.no/arbeid/dagpenger/mine-dagpenger");
  }

  return (
    <>
      <ReceiptSoknadTilstand {...props.soknadStatus} />
      <ArbeidssokerStatus {...props.arbeidssokerStatus} />
      <div className={styles.documentList}>
        <ReceiptDocumentsMissing documents={missingDocuments} />
        <ReceiptDocumentsOther />
        <ReceiptDocumentsUploaded documents={uploadedDocuments} />
        <ReceiptDocumentsNotSending documents={notSendingDocuments} />
      </div>
      <ReceiptYourAnswers sections={props.sections} />
      <Button
        variant="primary"
        className={styles.nagivateToMineDagpengerButton}
        onClick={navigateToMineDagpener}
      >
        {getAppTekst("kvittering.mine-dagpenger.knapp")}
      </Button>
      <NoSessionModal />
    </>
  );
}
