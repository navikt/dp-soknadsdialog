import { ClientRequest, request } from "http";
import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-quizshow-api`;

function checkForToken(session) {
  if (!session.token) {
    return Promise.reject(new Error("Ikke innlogget"));
  }
  return session.apiToken(audience);
}

const proxy = (url: URL = new URL(""), req: NextApiRequest, res: NextApiResponse) => {
  getSession({ req })
    .then(checkForToken)
    .then(async (apiToken) => {
      const token = await apiToken;
      const headers = {
        ...filterHeaders(req.headers),
        Authorization: `Bearer ${token}`,
      };
      return new Promise((resolve) => {
        const proxyResponseHandler = (resp) => {
          res.statusCode = resp.statusCode;
          copyHeaders(filterHeaders(resp.headers), res);
          resp.pipe(res);
          resp.on("end", () => {
            res.end();
            resolve(resp);
          });
        };

        const proxy: ClientRequest = request(
          url,
          {
            host: url.hostname,
            method: req.method,
            headers: headers,
          },
          proxyResponseHandler
        );
        req.pipe(proxy, { end: true });
      });
    });
};
export default proxy;

const copyHeaders = (headers, res) => {
  Object.entries(headers).forEach(([header, value]) => res.setHeader(header, value));
};
const filterHeaders = (headers) => {
  const bannedHeaders = ["server", "host"];
  return Object.fromEntries(
    Object.entries(headers).filter(([header]) => bannedHeaders.indexOf(header) === -1)
  );
};
