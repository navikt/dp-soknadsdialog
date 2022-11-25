import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

async function testHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    throw new Error("Fake error kastet");
  } catch (error) {
    return res.status(500).send("Failed");
  }

  return res.status(200).send("ok");
}

export default withSentry(testHandler);
