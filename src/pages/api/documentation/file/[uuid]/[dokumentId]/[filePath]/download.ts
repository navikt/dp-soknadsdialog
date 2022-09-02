import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audienceMellomlagring } from "../../../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const dokumentId = req.query.dokumentId as string;
  const fileId = req.query.filePath as string;

  // eslint-disable-next-line no-console
  console.log("Nextjs downloadHandler");
  // eslint-disable-next-line no-console
  console.log("uuid: ", uuid);
  // eslint-disable-next-line no-console
  console.log("dokumentId: ", dokumentId);
  // eslint-disable-next-line no-console
  console.log("fileId: ", fileId);

  if (token && apiToken) {
    try {
      const onBehalfOfToken = await apiToken(audienceMellomlagring);
      const response = await fetch(
        `${process.env.MELLOMLAGRING_BASE_URL}/${uuid}/${dokumentId}/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${onBehalfOfToken}`,
          },
        }
      );

      // eslint-disable-next-line no-console
      console.log(response);

      if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
      }

      // res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment;");
      return res.status(200).send(response.blob());
    } catch (error: unknown) {
      return res.status(404);
    }
  }
}

export default withSentry(downloadHandler);
