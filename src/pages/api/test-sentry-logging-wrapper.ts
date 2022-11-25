import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

async function testWrapperHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    throw new Error("Test withSentry wrapper on api route");
  } catch (error) {
    return res.status(500).send("Failed");
  }

  return res.status(200).send("ok");
}

export default withSentry(testWrapperHandler);
