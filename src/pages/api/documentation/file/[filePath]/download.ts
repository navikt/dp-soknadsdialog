import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audienceMellomlagring } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";

export const config = {
  api: {
    responseLimit: false,
  },
};

async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const filePath = req.query.filePath as string;

  if (token && apiToken) {
    try {
      const onBehalfOfToken = await apiToken(audienceMellomlagring);
      const response = await fetch(`${process.env.MELLOMLAGRING_BASE_URL}/${filePath}`, {
        headers: {
          Authorization: `Bearer ${onBehalfOfToken}`,
        },
      });

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
