import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceMellomlagring } from "../../../../../api.utils";
import { mockMellomlagringLagreFil } from "../../../../../localhost-data/dokumentkrav-list";
import { withSentry } from "@sentry/nextjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export function postDocumentation(
  uuid: string,
  dokumentkravId: string,
  files: Buffer,
  onBehalfOfToken: string,
  originalRequest: NextApiRequest
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/${uuid}/${dokumentkravId}`;

  return fetch(url, {
    method: "Post",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Content-Type": originalRequest.headers["content-type"] || "multipart/form-data",
      "Content-Length": originalRequest.headers["content-length"] || "",
      "User-Agent": originalRequest.headers["user-agent"] || "",
      accept: "application/json",
    },
    body: files,
  })
    .then((response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json(mockMellomlagringLagreFil);
  }

  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const buffers: any[] = [];

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audienceMellomlagring);
    req
      .on("readable", () => {
        const chunk = req.read();
        if (chunk !== null) {
          buffers.push(chunk);
        }
      })
      // listen on end event of request to send our data
      .on("end", async () => {
        try {
          const response = await postDocumentation(
            uuid,
            dokumentkravId,
            Buffer.concat(buffers),
            onBehalfOfToken,
            req
          );
          return res.status(200).json(response);
        } catch (error) {
          res.status(500).json(error);
        }

        res.status(405);
        res.send("Method Not Allowed");
      });
  } else {
    res.status(500);
    res.send('{"error": "Could not upload file"}');
  }
}

export default withSentry(uploadHandler);
