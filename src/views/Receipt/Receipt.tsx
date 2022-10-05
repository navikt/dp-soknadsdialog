import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { IDokumentkrav, IDokumentkravList } from "../../types/documentation.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import { ReceiptDocumentsMissing } from "../../components/receipt/ReceiptDocumentsMissing";
import { ReceiptSoknadTilstand } from "../../components/receipt/ReceiptSoknadtilstand";
import { ArbeidssokerStatus } from "../../components/receipt/ReceiptArbeidssokerStatus";
import { ReceiptDocumentsNotSending } from "../../components/receipt/ReceiptDocumentsNotSending";
import { ReceiptDocumentsUploaded } from "../../components/receipt/ReceiptDocumentsUploaded";
import { ReceiptDocumentsOther } from "../../components/receipt/ReceiptDocumentsOther";
import styles from "./Receipts.module.css";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ReceiptYourAnswers } from "../../components/receipt/ReceiptYourAnswers";
import { IQuizSeksjon } from "../../types/quiz.types";

interface IProps {
  soknadStatus: ISoknadStatus;
  dokumentkravList: IDokumentkravList;
  arbeidssokerStatus: IArbeidssokerStatus;
  sections: IQuizSeksjon[];
}

export function Receipt(props: IProps) {
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
      <NoSessionModal />
    </>
  );
}
