import { GET_ARBEIDSSOKER_STATUS_ERROR } from "./../../../sentry-constants";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { formatISO } from "date-fns";
import { decodeJwt } from "@navikt/dp-auth";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../sentry.logger";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "UNKNOWN";

async function arbeidssokerStatusHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ isArbeidssoker: false });
  }

  const session = await getSession(req);
  if (!session) return res.status(401).end();

  const payload = decodeJwt(session.token);
  const idtoken = req.cookies["selvbetjening-idtoken"];
  if (!idtoken || !payload?.pid) {
    return res.status(401).end();
  }

  const callId = uuid();
  const formattedDate = formatISO(new Date(), { representation: "date" });

  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload.pid}&fraOgMed=${formattedDate}`;

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
    logRequestError(GET_ARBEIDSSOKER_STATUS_ERROR, callId);
    return res.status(500).end(`Noe gikk galt (callId: ${callId})`);
  }
}

export default arbeidssokerStatusHandler;
