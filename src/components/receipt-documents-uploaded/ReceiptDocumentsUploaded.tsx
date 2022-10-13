import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { BodyShort, Button, Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsUploaded.module.css";
import api from "../../api.utils";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsUploaded(props: IProps) {
  const { getAppTekst } = useSanity();

  async function openFile(dokumentkrav: IDokumentkrav) {
    try {
      const res = await fetch(api(`/documentation/download/${dokumentkrav.bundleFilsti}`));

      if (res.ok) {
        const blob = await res.blob();
        const file = new Blob([blob], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);

        const pdfWindow = window.open();
        if (pdfWindow) {
          pdfWindow.location.href = fileURL;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
  return (
    <div>
      <div className={styles.headingContainer}>
        <Heading level={"2"} size="medium">
          {getAppTekst("kvittering.heading.mottatt.dokumenter")}
        </Heading>
        <Tag variant="success">
          {props.documents?.length} {getAppTekst("kvittering.text.antall-sendt")}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => (
        <div key={dokumentkrav.beskrivendeId} className={styles.documentItem}>
          <div>
            <BodyShort>
              <b>{dokumentkrav.beskrivendeId}</b>
            </BodyShort>
            <BodyShort>
              {`${getAppTekst("kvittering.heading.text.sendt-av")} ${
                dokumentkrav.filer[0]?.tidspunkt || "30.09.2022"
              }`}
            </BodyShort>
          </div>

          <Button onClick={() => openFile(dokumentkrav)}>Åpne</Button>
        </div>
      ))}
    </div>
  );
}
