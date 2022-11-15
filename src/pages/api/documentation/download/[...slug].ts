import { GET_MELLOMLARING_DOKUMENT_ERROR } from "./../../../../sentry-constants";
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { audienceMellomlagring } from "../../../../api.utils";
import fs from "fs";
import path from "path";
import { getSession } from "../../../../auth.utils";
import { logFetchError } from "../../../../sentry.logger";

const filePath = path.resolve("src/localhost-data/sample.pdf");
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

  const { slug } = req.query;
  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  // slug will always be an array when [...] is used https://nextjs.org/docs/api-routes/dynamic-api-routes
  // @ts-ignore
  const urn = slug.join("/");

  try {
    const onBehalfOfToken = await session.apiToken(audienceMellomlagring);
    const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`, {
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (!response.ok) {
      logFetchError(GET_MELLOMLARING_DOKUMENT_ERROR);
      throw new Error(`unexpected response ${response.statusText}`);
    }

    const mellomlagringContentType = response.headers.get("Content-Type");
    if (mellomlagringContentType) {
      res.setHeader("Content-Type", mellomlagringContentType);
    }

    res.setHeader("Content-Disposition", "inline;");
    return res.status(200).send(response.body);
  } catch (error) {
    logFetchError(GET_MELLOMLARING_DOKUMENT_ERROR);
    return res.status(404).send(error);
  }
}

export default withSentry(downloadHandler);
