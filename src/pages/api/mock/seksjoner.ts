import { NextApiRequest, NextApiResponse } from "next";
import { dummySeksjon } from "../../../soknad-fakta/dummy-seksjon";

const seksjoner = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json([dummySeksjon]);
};

export default seksjoner;
