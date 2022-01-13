import { NextApiRequest, NextApiResponse } from "next";
import { mockSeksjoner } from "./mock-data";

const nesteSeksjon = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json(mockSeksjoner[0]);
};

export default nesteSeksjon;
