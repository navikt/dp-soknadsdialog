import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { BodyShort, Heading } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsNotSending.module.css";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE } from "../../constants";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsNotSending(props: IProps) {
  const { getAppTekst, getDokumentkravTextById } = useSanity();
  return (
    <div>
      <Heading level={"2"} size="medium">
        {getAppTekst("kvittering.heading.sender-ikke-dokumenter")}
      </Heading>

      {props.documents.map((dokumentkrav) => {
        const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
        return (
          <div key={dokumentkrav.beskrivendeId} className={styles.documentItem}>
            <Heading level="3" size="xsmall">
              {dokumentkravText?.text ? dokumentkravText.text : dokumentkrav.beskrivendeId}
            </Heading>
            <BodyShort>
              <>
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE && (
                  <>{getAppTekst("kvittering.text.sendt-tidligere")}</>
                )}
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
                  <>{getAppTekst("kvittering.text.sender-ikke")}</>
                )}
              </>
            </BodyShort>
          </div>
        );
      })}
    </div>
  );
}
