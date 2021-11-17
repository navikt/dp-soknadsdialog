import proxy from "../../../_proxy";
import { NextApiRequest, NextApiResponse } from "next";

const faktumLagreHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { id, faktumId },
  } = req;

  const url = new URL(
    `${process.env.API_BASE_URL}/soknad/${id}/faktum/${faktumId}`
  );
  await proxy(url, req, res);
};

export default faktumLagreHandler;
