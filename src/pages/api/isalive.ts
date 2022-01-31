import type { NextApiRequest, NextApiResponse } from "next";

function isAliveHandler(req: NextApiRequest, res: NextApiResponse<string>): void {
  res.status(200).json("Alive");
}

export default isAliveHandler;
