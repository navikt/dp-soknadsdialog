import { GetServerSidePropsContext } from "next/types";
import { getSession, getVeilarbregistreringOnBehalfOfToken } from "../utils/auth.utils";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "UNKNOWN";
export interface IArbeidssokerperioder {
  arbeidssokerperioder: [
    {
      fraOgMedDato: string;
      tilOgMedDato: string | null;
    },
  ];
}

export async function getArbeidssokerperioder({ req }: GetServerSidePropsContext) {
  const session = await getSession(req);
  const onBehalfOfToken = await getVeilarbregistreringOnBehalfOfToken(session);

  const url = `${process.env.ARBEIDSSOEKERREGISTERET_URL}/api/v1/arbeidssoekerperioder`;

  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}
