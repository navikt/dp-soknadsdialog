import { IDokumentkravListe } from "../types/documentation.types";
import { mockDokumentkravList } from "../localhost-data/dokumentkrav-list";

export function getDocumentationList(
  uuid: string,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onBehalfOfToken: string
): Promise<IDokumentkravListe> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  return Promise.resolve(mockDokumentkravList);
  //}

  // return fetch(url, {
  //   method: "Get",
  //   headers: headersWithToken(onBehalfOfToken),
  // })
  //   .then((response: Response) => response.json())
  //   .catch((error) => {
  //     return Promise.reject(error);
  //   });
}
