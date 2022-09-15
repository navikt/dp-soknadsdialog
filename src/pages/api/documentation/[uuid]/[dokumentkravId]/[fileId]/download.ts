import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { withSentry } from "@sentry/nextjs";
import { audienceMellomlagring } from "../../../../../../api.utils";

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const fileId = req.query.fileId as string;

  try {
    const onBehalfOfToken = await apiToken(audienceMellomlagring);
    const response = await fetch(
      `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${uuid}/${dokumentkravId}/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${onBehalfOfToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }

    res.setHeader("Content-Disposition", "attachment;");
    return res.status(200).send(response.body);
  } catch (error) {
    return res.status(404).send(error);
  }
}

export default withSentry(downloadHandler);
