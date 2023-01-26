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

  switch (dokumentkrav.svar) {
    case DOKUMENTKRAV_SVAR_SEND_NAA:
      return <>{getAppText("dokumentkrav.begrunnelse.sendt-av-deg")}</>;
    case DOKUMENTKRAV_SVAR_SENDER_SENERE:
      return <>{getAppText("dokumentkrav.begrunnelse.sendes-av-deg")}</>;
    case DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE:
      return <>{getAppText("dokumentkrav.begrunnelse.sendt-tidligere")}</>;
    case DOKUMENTKRAV_SVAR_SENDER_IKKE:
      return <>{getAppText("dokumentkrav.begrunnelse.sender-ikke")}</>;
    case DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE:
      return <>{getAppText("dokumentkrav.begrunnelse.sendes-av-andre")}</>;
    default:
      return <></>;
  }
}
