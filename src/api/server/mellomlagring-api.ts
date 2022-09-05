import { NextApiRequest } from "next";

export function postDocumentation(
  uuid: string,
  dokumentkravId: string,
  files: Buffer,
  onBehalfOfToken: string,
  originalRequest: NextApiRequest
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/${uuid}/${dokumentkravId}`;

  return fetch(url, {
    method: "Post",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Content-Type": originalRequest.headers["content-type"] || "multipart/form-data",
      "Content-Length": originalRequest.headers["content-length"] || "",
      "User-Agent": originalRequest.headers["user-agent"] || "",
      accept: "application/json",
    },
    body: files,
  })
    .then((response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}
