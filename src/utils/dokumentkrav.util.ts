import {
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../constants";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";

export function getMissingDokumentkrav(dokumentkravList: IDokumentkravList): IDokumentkrav[] {
  return dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE ||
      (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !dokumentkrav.bundleFilsti)
  );
}

export function getUploadedDokumentkrav(dokumentkravList: IDokumentkravList): IDokumentkrav[] {
  return dokumentkravList.krav.filter(
    (dokumentkrav) => dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.bundleFilsti
  );
}

export function getNotSendingDokumentkrav(dokumentkravList: IDokumentkravList): IDokumentkrav[] {
  return dokumentkravList.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  );
}
