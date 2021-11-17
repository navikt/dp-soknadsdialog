import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-quizshow-api`;

const medAutentisertApi = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      getSession({ req })
        .then((session) => {
          if (!session.token) {
            return Promise.reject(new Error(`Ikke innlogget`));
          }
          return session.apiToken(audience);
        })
        .then(async (apiToken) => {
          const token = await apiToken;
          const headers = {
            ...filterHeaders(req.headers),
            Authorization: `Bearer ${token}`,
          };
          req.headers = headers;
          return handler(req, res);
        });
    } catch (e) {
      return res.status(401).json({
        melding: "ikke logget inn",
      });
    }
  };
};

export default medAutentisertApi;

const filterHeaders = (headers) => {
  const bannedHeaders = ["server", "host"];
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([header]) => bannedHeaders.indexOf(header) === -1
    )
  );
};
