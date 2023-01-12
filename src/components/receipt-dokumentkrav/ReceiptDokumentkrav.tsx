import React from "react";
import { Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav } from "../../types/documentation.types";
import { ISoknadStatus } from "../../types/quiz.types";
import { ReceiptDokumentkravMissingItem } from "./ReceiptDokumentkravMissingItem";
import { ReceiptDocumentsNotSending } from "../receipt-documents-not-sending/ReceiptDocumentsNotSending";
import { ReceiptDokumentkravUploadedItem } from "./ReceiptDokumentkravUploadedItem";
import { ReceiptUploadDocuments } from "../receipt-upload-documents/ReceiptUploadDocuments";
import { ReadMore } from "../sanity/readmore/ReadMore";
import styles from "./ReceiptDokumentkrav.module.css";

interface IProps {
  soknadStatus: ISoknadStatus;
  missingDocuments: IDokumentkrav[];
  uploadedDocuments: IDokumentkrav[];
  notSendingDocuments: IDokumentkrav[];
}
export function ReceiptDokumentkrav(props: IProps) {
  const { soknadStatus, missingDocuments, uploadedDocuments, notSendingDocuments } = props;
  const { getInfosideText, getAppText } = useSanity();
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
            {getAppText("kvittering.heading.dokumenter-sende-inn")}
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
