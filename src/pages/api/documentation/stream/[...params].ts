import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { getErrorMessage } from "../../../../utils/api.utils";
import { getMellomlagringOnBehalfOfToken } from "../../../../utils/auth.utils";
import { logRequestError } from "../../../../error.logger";
import { logger } from "@navikt/next-logger";

const filePath = path.resolve("src/localhost-data/sample.pdf");
const imageBuffer = fs.readFileSync(filePath);

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    res.setHeader("Content-Type", "application/pdf");
    return res.send(imageBuffer);
  }

  const { params } = req.query;
  // params will always be an array when [...] is used https://nextjs.org/docs/api-routes/dynamic-api-routes
  // @ts-ignore
  const urn = params.join("/");

  try {
    const onBehalfOf = await getMellomlagringOnBehalfOfToken(req);
    if (!onBehalfOf.ok) {
      return res.status(401).end();
    }

    logger.info("Starter streaming av dokumentkrav fil", { urn });

    const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`, {
      headers: {
        Authorization: `Bearer ${onBehalfOf.token}`,
      },
    });

    if (!response.ok) {
      logRequestError(
        response.statusText,
        undefined,
        "Download dokumentkrav files - Failed to download files from dp-mellomlagring",
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

export default downloadHandler;
