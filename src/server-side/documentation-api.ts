import { IDokumentkravListe } from "../types/documentation.types";
import { headersWithToken } from "./quiz-api";
import { mockDokumentkravList } from "../localhost-data/dokumentkrav-list";

export function getDocumentationList(
  uuid: string,
  onBehalfOfToken: string
): Promise<IDokumentkravListe> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(mockDokumentkravList);
  }

  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}
