import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getDocumentationList } from "../../../../api/server/documentation-api";
import { withSentry } from "@sentry/nextjs";

async function dokumentasjonskravHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    try {
      const documentationStatus = await getDocumentationList(uuid, onBehalfOfToken);
      return res.status(200).json(documentationStatus);
    } catch (error: unknown) {
      return res.status(500).end();
    }
  }

  res.status(404).end();
}

export default withSentry(dokumentasjonskravHandler);
