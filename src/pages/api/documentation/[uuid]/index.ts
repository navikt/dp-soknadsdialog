import { mockDokumentkravList } from "./../../../../localhost-data/dokumentkrav-list";
import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { IDokumentkravList } from "../../../../types/documentation.types";
import { headersWithToken } from "../../quiz-api";

export function getDocumentationList(
  uuid: string,
  onBehalfOfToken: string
): Promise<IDokumentkravList> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(mockDokumentkravList);
  }

  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

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
