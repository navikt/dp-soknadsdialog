import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { getErrorMessage } from "../../../../api.utils";
import { getMellomlagringOnBehalfOfToken, getSession } from "../../../../auth.utils";
import { logRequestError } from "../../../../error.logger";

const filePath = path.resolve("src/localhost-data/sample.pdf");
const imageBuffer = fs.readFileSync(filePath);

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS) {
    res.setHeader("Content-Type", "application/pdf");
    return res.send(imageBuffer);
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { params } = req.query;
  // params will always be an array when [...] is used https://nextjs.org/docs/api-routes/dynamic-api-routes
  // @ts-ignore
  const urn = params.join("/");

  try {
    const mellomlagringOboToken = await getMellomlagringOnBehalfOfToken(session);
    const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`, {
      headers: {
        Authorization: `Bearer ${mellomlagringOboToken}`,
      },
    });

    if (!response.ok) {
      logRequestError(
        response.statusText,
        undefined,
        "Download dokumentkrav files - Failed to download files from dp-mellomlagring"
      );
      return res.status(response.status).send(response.statusText);
    }

    const mellomlagringContentType = response.headers.get("Content-Type");
    if (mellomlagringContentType) {
      res.setHeader("Content-Type", mellomlagringContentType);
    }

    res.setHeader("Content-Disposition", "inline;");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return res.status(response.status).send(buffer);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Download dokumentkrav files - Generic error");
    return res.status(500).send(message);
  }
}

export default downloadHandler;
