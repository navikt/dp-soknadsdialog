import { v4 as uuid } from "uuid";
import { getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";

export async function getArbeidssokerStatus({ req }: GetServerSidePropsContext) {
  const today = formatISO(new Date(), { representation: "date" });

  const { payload } = await getSession({ req });
  const idtoken = req.cookies["selvbetjening-idtoken"];

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload?.pid}&fraOgMed=${today}`;

  // eslint-disable-next-line no-console
  console.log("getArbeidssokerStatus() URL: ", url);

  const response = await fetch(url.toString(), {
    headers: {
      cookie: `selvbetjening-idtoken=${idtoken}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Response: ", response);

  return response;
}
