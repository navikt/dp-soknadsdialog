import { NextApiRequest, NextApiResponse } from "next";

const faktumLagreHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { id, faktumId },
  } = req;

  const fakta = await fetch(
    `${process.env.API_BASE_URL}/soknad/${id}/faktum/${faktumId}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: req.body,
    }
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(await fakta.text());
};

export default faktumLagreHandler;
