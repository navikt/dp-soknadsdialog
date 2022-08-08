import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceMellomlagring } from "../../../../../api.utils";
import { postDocumentation } from "../../../../../server-side/mellomlagring-api";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const docid = req.query.docid as string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const buffers: any[] = [];

  // if (process.env.NEXT_PUBLIC_LOCALHOST) {
  //   return res.status(201).json({ content: "created" });
  // }

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
            docid,
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
    res.send('{"errror": "Could not upload file"}');
  }
}

export default uploadHandler;
