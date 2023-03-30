import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { audienceMellomlagring, getErrorMessage } from "../../../../api.utils";
import { getSession } from "../../../../auth.utils";
import { logRequestError } from "../../../../error.logger";

const filePath = path.resolve("src/__mocks__/mockdata/sample.pdf");
const imageBuffer = fs.readFileSync(filePath);

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
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
    const onBehalfOfToken = await session.apiToken(audienceMellomlagring);
    const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`, {
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
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
    return res.status(response.status).send(response.body);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Download dokumentkrav files - Generic error");
    return res.status(500).send(message);
  }
}

export default withSentry(downloadHandler);
