import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import {
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../../constants";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useSanity } from "../../context/sanity-context";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";
import { KVITTERING_HEADING_DOKUMENTER_SENDE_INN } from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { ReceiptDokumentkravMissingItem } from "./ReceiptDokumentkravMissingItem";
import { ReceiptDocumentsNotSending } from "../receipt-documents-not-sending/ReceiptDocumentsNotSending";
import { ReceiptDokumentkravUploadedItem } from "./ReceiptDokumentkravUploadedItem";
import { ReceiptUploadDocuments } from "../receipt-upload-documents/ReceiptUploadDocuments";
import { ReadMore } from "../../components/sanity/readmore/ReadMore";
import styles from "./ReceiptDokumentkrav.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
}
export function ReceiptDokumentkrav({ soknadStatus }: IProps) {
  const { getInfosideText, getAppText } = useSanity();
  const { dokumentkravList } = useDokumentkrav();

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

  const shouldShowEttersending = missingDocuments.length > 0 || uploadedDocuments.length > 0;

  const missingDokumentkravText = getInfosideText("kvittering.dokumentasjon");
  const allDokumentkravUploadedText = getInfosideText("kvittering.alle-dokumentkrav-ferdig");
  const noDokumentkravDocumentsText = getInfosideText("kvittering.ingen-dokumentkrav");
  const dokumentkravText =
    missingDocuments.length > 0 ? missingDokumentkravText : allDokumentkravUploadedText;

  return (
    <>
      {shouldShowEttersending && (
        <>
          {dokumentkravText && (
            <div className="my-12">
              <PortableText
                value={dokumentkravText.body}
                components={{ types: { readMore: ReadMore } }}
              />
            </div>
          )}

          <Heading level={"2"} size="small" className="my-6">
            {getAppText(KVITTERING_HEADING_DOKUMENTER_SENDE_INN)}
          </Heading>

          <ol className={styles.dokumentkravList}>
            {missingDocuments.map((dokumentkrav) => (
              <ReceiptDokumentkravMissingItem key={dokumentkrav.beskrivendeId} {...dokumentkrav} />
            ))}

            {uploadedDocuments.map((dokumentkrav) => (
              <ReceiptDokumentkravUploadedItem
                key={dokumentkrav.beskrivendeId}
                dokumentkrav={dokumentkrav}
              />
            ))}
          </ol>

          <ReceiptUploadDocuments soknadStatus={soknadStatus} />
        </>
      )}

      {!shouldShowEttersending && noDokumentkravDocumentsText && (
        <div className="my-12">
          <PortableText
            value={noDokumentkravDocumentsText.body}
            components={{ types: { readMore: ReadMore } }}
          />
        </div>
      )}

      {notSendingDocuments.length > 0 && (
        <ReceiptDocumentsNotSending documents={notSendingDocuments} />
      )}
    </>
  );
}
