export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "ERROR";
type brukerTypeResponse = "UKJENT_VERDI" | "UDEFINERT" | "VEILEDER" | "SYSTEM" | "SLUTTBRUKER";

export interface IArbeidssokerperioder {
  periodeId: string;
  startet: IArbeidssoekkerMetaResponse;
  avsluttet: IArbeidssoekkerMetaResponse | null;
}

interface IArbeidssoekkerMetaResponse {
  tidspunkt: string;
  utfoertAv: { type: brukerTypeResponse };
  kilde: string;
  aarsak: string;
}

export async function getArbeidssokerperioder(onBehalfOfToken: string) {
  const url = `${process.env.ARBEIDSSOEKERREGISTERET_URL}/api/v1/arbeidssoekerperioder`;

  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
