import { NextApiRequest, NextApiResponse } from "next";

async function lolHandler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  console.log("Request metode: ", req.method);

  return res.status(200).json({ status: "ok" });
}

export default lolHandler;
