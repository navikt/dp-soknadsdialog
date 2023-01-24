import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import {
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../../constants";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function DokumentkravSvar({ dokumentkrav }: IProps) {
  const { getAppText } = useSanity();

  let svarText: string | undefined;

  switch (dokumentkrav.svar) {
    case DOKUMENTKRAV_SVAR_SEND_NAA:
      svarText = "dokumentkrav.begrunnelse.sendt-av-deg";
      break;
    case DOKUMENTKRAV_SVAR_SENDER_SENERE:
      svarText = "dokumentkrav.begrunnelse.sendes-av-deg";
      break;
    case DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE:
      svarText = "dokumentkrav.begrunnelse.sendt-tidligere";
      break;
    case DOKUMENTKRAV_SVAR_SENDER_IKKE:
      svarText = "dokumentkrav.begrunnelse.sender-ikke";
      break;
    case DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE:
      svarText = "dokumentkrav.begrunnelse.sendes-av-andre";
      break;
  }

  return <>{svarText && getAppText(svarText)}</>;
}
