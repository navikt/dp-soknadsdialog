import { formatISO } from "date-fns";
import { GetServerSidePropsContext } from "next/types";
import { v4 as uuid } from "uuid";
import { getSession, getVeilarbregistreringOboToken } from "../auth.utils";

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
  const session = await getSession(req);
  const veilarbregistreringOboToken = await getVeilarbregistreringOboToken(session);

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}/veilarbregistrering/api/arbeidssoker/perioder?fraOgMed=${today}`;

  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${veilarbregistreringOboToken}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });
}
