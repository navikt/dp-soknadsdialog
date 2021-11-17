import { request } from "http";
import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-quizshow-api`;

const proxy = (
  url: URL = new URL(""),
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
      return new Promise((resolve) => {
        const proxy = request(
          url,
          {
            host: url.hostname,
            method: req.method,
            headers: headers,
          },
          (resp) => {
            res.statusCode = resp.statusCode;
            copyHeaders(filterHeaders(resp.headers), res);

            resp.pipe(res);

            resp.on("end", () => {
              res.end();
              resolve(resp);
            });
          }
        );
        req.pipe(proxy);
      });
    });
};
export default proxy;

const copyHeaders = (headers, res) => {
  Object.entries(headers).forEach(([header, value]) =>
    res.setHeader(header, value)
  );
};
const filterHeaders = (headers) => {
  const bannedHeaders = ["server", "host"];
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([header]) => bannedHeaders.indexOf(header) === -1
    )
  );
};
