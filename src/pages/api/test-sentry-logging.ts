import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../sentry.logger";

async function testHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    throw new Error("Fake error kastet");
  } catch (error) {
    logRequestError("Test custom request error logger");
    return res.status(500).send("Failed");
  }

  return res.status(200).send("ok");
}

export default testHandler;
