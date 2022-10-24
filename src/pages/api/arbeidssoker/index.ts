import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { v4 as uuid } from "uuid";

const periodeFormatter = new Intl.DateTimeFormat("no", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formaterDato(date: Date) {
  return periodeFormatter.format(date).split(".").reverse().join("-");
}

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "UNKNOWN";

async function arbeidssokerStatusHandler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  console.log(formaterDato(new Date()));
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ isArbeidssoker: false });
  }

  const { token, payload } = await getSession({ req });
  const idtoken = req.cookies["selvbetjening-idtoken"];
  if (!token || !idtoken || !payload?.pid) {
    // eslint-disable-next-line no-console
    console.log("Mangler token");
    return res.status(401).end();
  }

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload.pid}&fraOgMed=${formaterDato(
    new Date()
  )}`;

  try {
    const response = await fetch(url.toString(), {
      headers: {
        cookie: `selvbetjening-idtoken=${idtoken}`,
        "Nav-Consumer-Id": "dp-soknadsdialog",
        "Nav-Call-Id": callId,
      },
    });

    if (response.ok) {
      return response.json();
    }

    return res.status(response.status).send(response.statusText);
  } catch (error) {
    // TODO Sentry logg
    // eslint-disable-next-line no-console
    console.error(`Kall mot veilarbregistrering (callId: ${callId}) feilet. Feilmelding: ${error}`);

    return res.status(500).end(`Noe gikk galt (callId: ${callId})`);
  }
}

export default arbeidssokerStatusHandler;
