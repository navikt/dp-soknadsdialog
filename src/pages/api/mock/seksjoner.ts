import { NextApiRequest, NextApiResponse } from "next";
import { mockSeksjoner } from "../../../../__mocks__/mock-data";

const seksjoner = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json(mockSeksjoner);
};

export default seksjoner;
