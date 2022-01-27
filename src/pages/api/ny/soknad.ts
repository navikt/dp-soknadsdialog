import { NextApiRequest, NextApiResponse } from "next";
import { mockSeksjoner } from "../../../soknad-fakta/soknad";

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ seksjoner: mockSeksjoner });
};

export default soknad;
