import { request } from "http";

export default function proxy(url = new URL(""), req, res) {
  return new Promise((resolve) => {
    const proxy = request(
      url,
      {
        host: url.hostname,
        method: req.method,
        headers: filterHeaders(req.headers),
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
}

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
