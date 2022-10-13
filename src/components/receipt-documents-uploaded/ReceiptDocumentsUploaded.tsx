import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { BodyShort, Heading, Link, Tag } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsUploaded.module.css";
import api from "../../api.utils";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsUploaded(props: IProps) {
  const { getAppTekst } = useSanity();
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
          {/*<Button variant="tertiary" onClick={() => handleOpenFile(dokumentkrav.bundleFilsti as string)}>*/}
          {/*  Åpne*/}
          {/*</Button>*/}

          <Link
            href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
            download={`${dokumentkrav.bundleFilsti}.pdf`}
            id={dokumentkrav.bundleFilsti}
          >
            Last ned {dokumentkrav.bundleFilsti}
          </Link>

          <Link
            href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
            target="_blank"
            rel="noreferrer"
          >
            Åpne {dokumentkrav.bundleFilsti}
          </Link>
        </div>
      ))}
    </div>
  );
}
