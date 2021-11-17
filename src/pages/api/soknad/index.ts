import proxy from "../_proxy";
import { NextApiRequest, NextApiResponse } from "next";

const søknadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL(`${process.env.API_BASE_URL}/soknad`);
  await proxy(url, req, res);
};

export default søknadHandler;
