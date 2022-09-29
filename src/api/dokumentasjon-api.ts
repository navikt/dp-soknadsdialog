import api from "../api.utils";
import { IDokumentkrav, IDokumentkravFil } from "../types/documentation.types";

interface IDokumentkravSvar {
  svar: string;
  begrunnelse: string | undefined;
}

export async function saveDokumentkravSvar(
  uuid: string,
  dokumentkravId: string,
  payload: IDokumentkravSvar
) {
  return fetch(api(`/documentation/${uuid}/${dokumentkravId}/svar`), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function saveDokumenkravFile(file: File, uuid: string, dokumentkravId: string) {
  const requestData = new FormData();
  requestData.append("file", file);

  // Do NOT specify content-type here, it gets browser generated with the correct boundary by default
  return fetch(api(`/documentation/${uuid}/${dokumentkravId}/file/save`), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: requestData,
  });
}

export async function deleteDokumentkravFile(
  uuid: string,
  dokumentkravId: string,
  file: IDokumentkravFil
) {
  return fetch(api(`/documentation/${uuid}/${dokumentkravId}/file/delete`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
}

export async function bundleDokumentkravFiles(uuid: string, dokumentkrav: IDokumentkrav) {
  const body = {
    soknadId: uuid,
    filer: dokumentkrav.filer.map((file) => ({ urn: file.urn })),
    bundleNavn: dokumentkrav.id,
  };

  return fetch(api(`/documentation/${uuid}/${dokumentkrav.id}/bundle`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
