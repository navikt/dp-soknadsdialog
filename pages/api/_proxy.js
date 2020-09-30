import { request } from "http";

export default function proxy(url = new URL(""), req, res) {
  return new Promise((resolve) => {
    const proxy = request(
      url,
      {
        host: url.hostname,
        method: req.method,
        headers: req.headers,
      },
      (resp) => {
        res.statusCode = resp.statusCode;
        copyHeaders(resp.headers, res);

        resp.pipe(res);

        resp.on("end", () => {
          res.end();
          resolve(resp);
        });
      }
    );

    req.pipe(proxy);
  });
}

const copyHeaders = (headers, res) => {
  const bannedHeaders = ["server"];
  Object.entries(headers)
    .filter(([header]) => !!bannedHeaders.indexOf(header))
    .forEach(([header, value]) => res.setHeader(header, value));
};
