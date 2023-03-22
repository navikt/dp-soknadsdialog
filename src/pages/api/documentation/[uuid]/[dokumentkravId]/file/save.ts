import { withSentry } from "@sentry/nextjs";
import { v4 as uuidV4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import {
  audienceDPSoknad,
  audienceMellomlagring,
  getErrorMessage,
} from "../../../../../../api.utils";
import { getSession } from "../../../../../../auth.utils";
import { logRequestError } from "../../../../../../sentry.logger";
import { IDokumentkravFil } from "../../../../../../types/documentation.types";
import { headersWithToken } from "../../../../../../api/quiz-api";
import Metrics from "../../../../../../metrics";
import { logger } from "@navikt/next-logger";

// Needed to allow files to be uploaded
export const config = {
  api: {
    bodyParser: false,
  },
};

async function saveFileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({
      filsti: "path-to-file",
      filnavn: "filnavn",
      urn: "urn-til-fil",
      tidspunkt: "30.09.2022",
      storrelse: 654654,
    });
  }

  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  const callId = uuidV4();
  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);

  res.setHeader("X-Request-Id", callId);

  try {
    const mellomlagringResponse = await saveFileToMellomlagring(
      req,
      uuid,
      dokumentkravId,
      mellomlagringToken,
      callId
    );

    if (!mellomlagringResponse.ok) {
      logRequestError(mellomlagringResponse.statusText, uuid);
      return res.status(mellomlagringResponse.status).send(mellomlagringResponse.statusText);
    }

    const fileData = await mellomlagringResponse.json();
    const dpSoknadResponse = await saveFileToDPSoknad(
      uuid,
      dokumentkravId,
      DPSoknadToken,
      fileData[0],
      callId
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(dpSoknadResponse.statusText, uuid);
      return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
    }

    return res.status(dpSoknadResponse.status).send(fileData[0]);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid);
    return res.status(500).send(message);
  }
}

async function saveFileToMellomlagring(
  req: NextApiRequest,
  uuid: string,
  dokumentkravId: string,
  mellomLagringToken: string,
  callId: string
) {
  const buffers: Uint8Array[] = [];

  await new Promise((resolve) => {
    req
      .on("readable", () => {
        const chunk = req.read();
        if (chunk !== null) {
          buffers.push(chunk);
        }
      })
      .on("end", async () => {
        return resolve(buffers);
      });
  });

  const fileSizeBytes = Number(req.headers["content-length"]);
  if (!isNaN(fileSizeBytes)) {
    Metrics.filOpplastetStørrelse.observe(fileSizeBytes);
  }

  logger.info(
    `Begynner å ta imot fil for uuid=${uuid}, dokumentkravId=${dokumentkravId}, bytes=${fileSizeBytes}, callId=${callId}`
  );

  const url = `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${uuid}/${dokumentkravId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...headersWithToken(mellomLagringToken),
      "User-Agent": req.headers["user-agent"] || "",
      "Content-Length": req.headers["content-length"] || "",
      "Content-Type": req.headers["content-type"] || "multipart/form-data",
      "X-Request-Id": callId,
    },
    body: Buffer.concat(buffers),
  });

  if (!response.ok) {
    logger.error(
      `Mottak av fil for uuid=${uuid}, dokumentkravId=${dokumentkravId}, bytes=${fileSizeBytes} feilet, callId=${callId}, status=${response.status}`
    );
    if (!isNaN(fileSizeBytes)) {
      Metrics.filOpplastetFeilet.observe(fileSizeBytes);
    }
  }
  return response;
}

async function saveFileToDPSoknad(
  uuid: string,
  dokumentkravId: string,
  DPSoknadToken: string,
  fil: IDokumentkravFil,
  callId: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/fil`;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(fil),
    headers: {
      ...headersWithToken(DPSoknadToken),
      "X-Request-Id": callId,
    },
  });
}

export default withSentry(saveFileHandler);
