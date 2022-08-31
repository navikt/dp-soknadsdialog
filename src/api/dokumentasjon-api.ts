import api from "../api.utils";
import { IDokumentkrav, IDokumentkravFil } from "../types/documentation.types";

export async function saveDokumentkrav(uuid: string, dokumentkrav: IDokumentkrav) {
  const url = api(`/documentation/${uuid}/${dokumentkrav.id}/save`);

  const saveRequest = fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      ...dokumentkrav,
    }),
  });

  try {
    const res = await saveRequest;

    if (res.ok) {
      return res.json();
    } else {
      throw Error(res.statusText);
    }
  } catch {
    throw Error();
  }
}

export async function saveDokumentkravBegrunnelse(
  uuid: string,
  dokumentkrav: IDokumentkrav,
  begrunnelse: string
) {
  const updatedDokumentkrav = { ...dokumentkrav, begrunnelse };
  return saveDokumentkrav(uuid, updatedDokumentkrav);
}

export async function saveDokumentkravSvar(
  uuid: string,
  dokumentkrav: IDokumentkrav,
  svar: string
) {
  const updatedDokumentkrav = { ...dokumentkrav, svar };
  return saveDokumentkrav(uuid, updatedDokumentkrav);
}

export async function saveDokumentkravFiler(
  uuid: string,
  dokumentkrav: IDokumentkrav,
  filer: IDokumentkravFil[]
) {
  const updatedDokumentkrav = { ...dokumentkrav, filer };
  return saveDokumentkrav(uuid, updatedDokumentkrav);
}
