import React from "react";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../constants";
import { ReceiptDocumentsMissing } from "../components/receipt/ReceiptDocumentsMissing";
import { ReceiptSoknadStatus } from "../components/receipt/ReceiptSoknadStatus";
import { ArbeidssokerStatus } from "../components/receipt/ReceiptArbeidssokerStatus";
import { ReceiptDocumentsNotSending } from "../components/receipt/ReceiptDocumentsNotSending";
import { ReceiptDocumentsUploaded } from "../components/receipt/ReceiptDocumentsUploaded";
import { ReceiptDocumentsOther } from "../components/receipt/ReceiptDocumentsOther";

interface IProps {
  dokumentkravList: IDokumentkravList;
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
      <ReceiptSoknadStatus />
      <ArbeidssokerStatus />
      <ReceiptDocumentsMissing documents={missingDocuments} />
      <ReceiptDocumentsOther />
      <ReceiptDocumentsUploaded documents={uploadedDocuments} />
      <ReceiptDocumentsNotSending documents={notSendingDocuments} />
      <NoSessionModal />
    </>
  );
}
