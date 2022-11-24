import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { BodyShort, Heading } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE } from "../../constants";
import {
  DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE,
} from "../../text-constants";
import styles from "./ReceiptDocumentsNotSending.module.css";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsNotSending(props: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  return (
    <div className="my-12">
      <Heading level={"2"} size="small" className="my-6">
        {getAppText("kvittering.heading.sender-ikke-dokumenter")}
      </Heading>

      <ol className={styles.dokumentkravList}>
        {props.documents.map((dokumentkrav) => {
          const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
          return (
            <li key={dokumentkrav.beskrivendeId} className="my-6">
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
            </li>
          );
        })}
      </ol>
    </div>
  );
}
