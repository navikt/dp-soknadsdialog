import { GetServerSidePropsContext } from "next/types";
import { getSession, getArbeidsoekkerregisteretOnBehalfOfToken } from "../utils/auth.utils";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "ERROR";
type brukerTypeResponse = "UKJENT_VERDI" | "UDEFINERT" | "VEILEDER" | "SYSTEM" | "SLUTTBRUKER";

export interface IArbeidssokerperioder {
  periodeId: string;
  startet: IArbeidssoekkerMetaResponse;
  avsluttet: IArbeidssoekkerMetaResponse | null;
}

interface IArbeidssoekkerMetaResponse {
  tidspunkt: string;
  utfoetAv: brukerTypeResponse;
  kilde: string;
  aarsak: string;
}

export async function getArbeidssokerperioder({ req }: GetServerSidePropsContext) {
  const session = await getSession(req);
  const onBehalfOfToken = await getArbeidsoekkerregisteretOnBehalfOfToken(session);

  const url = `${process.env.ARBEIDSSOEKERREGISTERET_URL}/api/v1/arbeidssoekerperioder`;

  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
