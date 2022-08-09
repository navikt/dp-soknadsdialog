import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceMellomlagring } from "../../../../../api.utils";
import { getDocumentation } from "../../../../../server-side/mellomlagring-api";

async function completeHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const docid = req.query.docid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json([
      { filnavn: "fil1.jpg", urn: "urn:vedlegg:id/fil1" },
      { filnavn: "filnavn2.jpg", urn: "urn:vedlegg:id/fil2" },
    ]);
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audienceMellomlagring);
    try {
      const vedleggResponse = await getDocumentation(uuid, docid, onBehalfOfToken);
      return res.status(200).json(vedleggResponse);
    } catch (error: unknown) {
      return res.status(500).end();
    }
  }

  res.status(404).end();
}
export default completeHandler;
