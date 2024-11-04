import { logger } from "@navikt/next-logger";
import fs from "fs";
import https from "https";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { logRequestError } from "../../../../error.logger";
import { getErrorMessage } from "../../../../utils/api.utils";
import { getMellomlagringOnBehalfOfToken } from "../../../../utils/auth.utils";

const filePath = path.resolve("src/localhost-data/sample.pdf");
const imageStream = fs.createReadStream(filePath);

// Handle the stream events
imageStream.on("data", (chunk) => {
  // Process the chunk of data
  console.log("Received a chunk of data:", chunk);
});

imageStream.on("end", () => {
  console.log("Finished reading the file.");
});

imageStream.on("error", (err) => {
  console.error("An error occurred:", err);
});

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
    return res.send(imageStream);
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

    const requestUrl = `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`;

    console.log(`🔥 requestUrl :`, requestUrl);
    const requestHeader = {
      headers: {
        Authorization: `Bearer ${onBehalfOf.token}`,
      },
    };

    https
      .get(requestUrl, requestHeader, (proxyRes) => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
          return handleProxyError(proxyRes as NextApiRequest, res);
        }

        const mellomlagringContentType = proxyRes.headers["content-type"];
        if (mellomlagringContentType) {
          res.setHeader("Content-Type", mellomlagringContentType);
        }

        res.setHeader("Content-Disposition", "inline");
        proxyRes.pipe(res);
      })
      .on("error", (error: Error) => handleStreamError(error, res));
  } catch (error) {
    handleStreamError(error as Error, res);
  }
}

function handleProxyError(proxyRes: NextApiRequest, res: NextApiResponse): void {
  const error = new Error(
    `Failed to download files from dp-mellomlagring: ${proxyRes.statusMessage}`,
  );
  logRequestError(
    error.message,
    undefined,
    "Download dokumentkrav files - Failed to download files from dp-mellomlagring",
  );
  res.status(proxyRes.statusCode || 500).send(proxyRes.statusMessage || "Error");
}

function handleStreamError(error: Error, res: NextApiResponse): void {
  const message = getErrorMessage(error);
  logRequestError(message, undefined, "Download dokumentkrav files - Generic error");
  res.status(500).send(message);
}

export default downloadHandler;
