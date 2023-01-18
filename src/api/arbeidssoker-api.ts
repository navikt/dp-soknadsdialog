import { v4 as uuid } from "uuid";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";
import { getSession } from "../auth.utils";
import { audienceVeilarb } from "../api.utils";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "UNKNOWN";
export interface IArbeidssokerperioder {
  arbeidssokerperioder: [
    {
      fraOgMedDato: string;
      tilOgMedDato: string | null;
    }
  ];
}

export async function getArbeidssokerperioder({ req }: GetServerSidePropsContext) {
  const today = formatISO(new Date(), { representation: "date" });
  const { apiToken } = await getSession(req);

  const callId = uuid();
  const onBehalfOfToken = await apiToken(audienceVeilarb);
  const url = `${process.env.VEILARBPROXY_URL}/niva3?fraOgMed=${today}`;

  return await fetch(url, {
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });
}
