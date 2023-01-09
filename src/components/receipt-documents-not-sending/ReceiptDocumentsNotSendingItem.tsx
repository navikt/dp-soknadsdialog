import React from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import { DOKUMENTKRAV_SVAR_SENDER_IKKE, DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE } from "../../constants";
import {
  DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE,
} from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function ReceiptDocumentsNotSendingItem({ dokumentkrav }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  return (
    <li className="my-6">
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
}
