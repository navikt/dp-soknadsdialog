import proxy from "../../_proxy";
import { NextApiRequest, NextApiResponse } from "next";

const nextSeksjonHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { id },
  } = req;
  const url = new URL(`${process.env.API_BASE_URL}/soknad/${id}/neste-seksjon`);
  await proxy(url, req, res);
};

export default nextSeksjonHandler;
