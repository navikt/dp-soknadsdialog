import { v4 as uuid } from "uuid";
import { getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";

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
  const { payload, token } = await getSession({ req });

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
