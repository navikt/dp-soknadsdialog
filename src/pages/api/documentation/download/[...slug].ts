import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { withSentry } from "@sentry/nextjs";
import { audienceMellomlagring } from "../../../../api.utils";
import fs from "fs";
import path from "path";

const filePath = path.resolve("src/localhost-data/sample.pdf");
const imageBuffer = fs.readFileSync(filePath);

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    res.setHeader("Content-Disposition", "inline;");
    return res.send(imageBuffer);
  }

  const { slug } = req.query;
  const { token, apiToken } = await getSession({ req });

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  // slug will always be an array when [...] is used https://nextjs.org/docs/api-routes/dynamic-api-routes
  // @ts-ignore
  const urn = slug.join("/");

  try {
    const onBehalfOfToken = await apiToken(audienceMellomlagring);
    const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${urn}`, {
      headers: {
        Authorization: `Bearer ${onBehalfOfToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }

    // eslint-disable-next-line no-console
    console.log("Mellomlagring headers: ", response.headers);
    const mellomlagringContentType = response.headers.get("Content-Type");
    // eslint-disable-next-line no-console
    console.log("mellomlagringContentType: ", mellomlagringContentType);
    if (mellomlagringContentType) {
      res.setHeader("Content-Type", mellomlagringContentType);
    }

    res.setHeader("Content-Disposition", "inline;");
    return res.status(200).send(response.body);
  } catch (error) {
    return res.status(404).send(error);
  }
}

export default withSentry(downloadHandler);
