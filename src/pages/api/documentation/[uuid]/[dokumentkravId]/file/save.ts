import { NextApiRequest, NextApiResponse } from "next";
import { headersWithToken } from "../../../../quiz-api";
import { IDokumentkravFil } from "../../../../../../types/documentation.types";
import { withSentry } from "@sentry/nextjs";
import { audienceDPSoknad, audienceMellomlagring } from "../../../../../../api.utils";
import { getSession } from "../../../../../../auth.utils";

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

  const { token, apiToken } = await getSession(req);

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const DPSoknadToken = await apiToken(audienceDPSoknad);
  const mellomlagringToken = await apiToken(audienceMellomlagring);

  try {
    const mellomlagringResponse = await saveFileToMellomlagring(
      req,
      uuid,
      dokumentkravId,
      mellomlagringToken
    );

    if (!mellomlagringResponse.ok) {
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
      throw new Error("Feil ved lagring til dp-soknad");
    }

    return res.status(dpSoknadResponse.status).send(fileData[0]);
  } catch (error) {
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
