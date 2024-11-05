import { proxyApiRouteRequest } from "@navikt/next-api-proxy";
import { logger } from "@navikt/next-logger";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { logRequestError } from "../../../../error.logger";
import { getErrorMessage } from "../../../../utils/api.utils";
import { getMellomlagringOnBehalfOfToken } from "../../../../utils/auth.utils";

const filePath = path.resolve("src/localhost-data/sample.pdf");
const fileStream = fs.createReadStream(filePath);

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
    externalResolver: true,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    res.setHeader("Content-Type", "application/pdf");
    return res.send(fileStream);
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

    // Proxy the request
    await proxyApiRouteRequest({
      hostname: "dp-mellomlagring",
      path: `/v1/obo/mellomlagring/vedlegg/${urn}`,
      req,
      res,
      bearerToken: onBehalfOf.token,
      https: false,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Download dokumentkrav files - Generic error");
    res.status(500).send(message);
  }
}

export default downloadHandler;
