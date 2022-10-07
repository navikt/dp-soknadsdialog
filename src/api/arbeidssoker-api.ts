import { v4 as uuid } from "uuid";
import { getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";

export async function getArbeidssokerStatus({ req }: GetServerSidePropsContext) {
  const today = formatISO(new Date(), { representation: "date" });

  const { payload, token } = await getSession({ req });
  const idtoken = req.cookies["selvbetjening-idtoken"];

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload?.pid}&fraOgMed=${today}`;

  // eslint-disable-next-line no-console
  console.log("getArbeidssokerStatus() URL: ", url);
  // eslint-disable-next-line no-console
  console.log("idtoken: ", idtoken);
  // eslint-disable-next-line no-console
  console.log("token: ", token);

  return await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Downstream-Authorization": `Bearer ${token}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });
}
