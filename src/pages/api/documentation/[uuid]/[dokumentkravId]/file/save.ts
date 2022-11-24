import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad, audienceMellomlagring } from "../../../../../../api.utils";
import { getSession } from "../../../../../../auth.utils";
import {
  SAVE_DOKUMENTS_ERROR,
  SAVE_FILE_FROM_TO_DP_MELLOMLAGRING_ERROR,
  SAVE_FILE_FROM_TO_DP_SOKNAD_ERROR,
} from "../../../../../../sentry-constants";
import { logRequestError } from "../../../../../../sentry.logger";
import { IDokumentkravFil } from "../../../../../../types/documentation.types";
import { headersWithToken } from "../../../../quiz-api";
import Metrics from "../../../../../../metrics";

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

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);

  try {
    const mellomlagringResponse = await saveFileToMellomlagring(
      req,
      uuid,
      dokumentkravId,
      mellomlagringToken
    );

    if (!mellomlagringResponse.ok) {
      logRequestError(SAVE_FILE_FROM_TO_DP_MELLOMLAGRING_ERROR, uuid);
      throw new Error("Feil ved lagring til dp-mellomlagring");
    }

    const fileData = await mellomlagringResponse.json();
    const dpSoknadResponse = await saveFileToDPSoknad(
      uuid,
      dokumentkravId,
      DPSoknadToken,
      fileData[0]
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(SAVE_FILE_FROM_TO_DP_SOKNAD_ERROR, uuid);
      throw new Error("Feil ved lagring til dp-soknad");
    }

    return res.status(dpSoknadResponse.status).send(fileData[0]);
  } catch (error) {
    logRequestError(SAVE_DOKUMENTS_ERROR, uuid);
    return res.status(500).send(error);
  }
}

async function saveFileToMellomlagring(
  req: NextApiRequest,
  uuid: string,
  dokumentkravId: string,
  mellomLagringToken: string
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
    Metrics.filstørrelseOpplastet.observe(fileSizeBytes);
  }

  const url = `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${uuid}/${dokumentkravId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      ...headersWithToken(mellomLagringToken),
      "User-Agent": req.headers["user-agent"] || "",
      "Content-Length": req.headers["content-length"] || "",
      "Content-Type": req.headers["content-type"] || "multipart/form-data",
    },
    body: Buffer.concat(buffers),
  }).catch((e) => {
    if (!isNaN(fileSizeBytes)) {
      Metrics.filstørrelseOpplastetFeilet.observe(fileSizeBytes);
    }
    throw e;
  });
}

async function saveFileToDPSoknad(
  uuid: string,
  dokumentkravId: string,
  DPSoknadToken: string,
  fil: IDokumentkravFil
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/fil`;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(fil),
    headers: headersWithToken(DPSoknadToken),
  });
}

export default withSentry(saveFileHandler);
