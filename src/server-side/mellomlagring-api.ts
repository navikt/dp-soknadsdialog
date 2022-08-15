import { NextApiRequest } from "next";

export function getDocumentation(uuid: string, docid: string, onBehalfOfToken: string) {
  const id = `${uuid}-${docid}`;
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/${id}`;
  return fetch(url, {
    method: "Get",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(new Error(error));
    });
}

export function postDocumentation(
  uuid: string,
  soknadsId: string,
  files: Buffer,
  onBehalfOfToken: string,
  originalRequest: NextApiRequest
) {
  const id = `${uuid}-${soknadsId}`;
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/${id}`;

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
