import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { BodyShort, Heading } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsNotSending.module.css";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE } from "../../constants";
import {
  DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE,
} from "../../text-constants";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsNotSending(props: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  return (
    <div>
      <Heading level={"2"} size="medium">
        {getAppText("kvittering.heading.sender-ikke-dokumenter")}
      </Heading>

      {props.documents.map((dokumentkrav) => {
        const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
        return (
          <div key={dokumentkrav.beskrivendeId} className={styles.documentItem}>
            <Heading level="3" size="xsmall">
              {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
            </Heading>
            <BodyShort>
              <>
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE && (
                  <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE)}</>
                )}
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
                  <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE)}</>
                )}
              </>
            </BodyShort>
          </div>
        );
      })}
    </div>
  );
}
