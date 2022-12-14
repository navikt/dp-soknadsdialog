import { v4 as uuid } from "uuid";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";
import { decodeJwt } from "@navikt/dp-auth";
import { getSession } from "../auth.utils";

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
  const { token } = await getSession(req);
  const payload = decodeJwt(token);

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload?.pid}&fraOgMed=${today}`;

  return await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Downstream-Authorization": `Bearer ${token}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });
}
