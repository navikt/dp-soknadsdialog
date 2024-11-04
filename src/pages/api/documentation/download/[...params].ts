import { logger } from "@navikt/next-logger";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Readable } from "stream";
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

    const requestHeaders = {
      headers: {
        Authorization: `Bearer ${onBehalfOf.token}`,
      },
    };

    const response = await fetch(requestUrl, requestHeaders);

    if (!response.ok) {
      logRequestError(
        response.statusText,
        undefined,
        "Download dokumentkrav files - Failed to download files from dp-mellomlagring",
      );

      res.status(500).send(response.statusText);
    }

    const mellomlagringContentType = response.headers.get("content-type");
    if (mellomlagringContentType) {
      res.setHeader("Content-Type", mellomlagringContentType);
    }

    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Transfer-Encoding", "chunked");

    if (!response.body) {
      const handlerErrorMessage = "Missing request body to generate readable stream";
      const logErrorMessage =
        "Download dokumentkrav files - Missing request body to generate readable stream";

      logRequestError(handlerErrorMessage, undefined, logErrorMessage);

      res.status(500).send(handlerErrorMessage);
    }

    // @ts-ignore
    const stream = Readable.fromWeb(response.body);

    stream.pipe(res);

    stream.on("error", (err) => {
      const handlerErrorMessage = "Error streaming dokumentkrav file";
      const logErrorMessage =
        "Download dokumentkrav files - Failed to streaming dokumentkrav file from dp-mellomlagring";

      logRequestError(err.message, undefined, logErrorMessage);
      res.status(500).send(handlerErrorMessage);
    });

    stream.on("end", () => {
      res.end();
    });
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Download dokumentkrav files - Generic error");
    res.status(500).send(message);
  }
}

export default downloadHandler;
