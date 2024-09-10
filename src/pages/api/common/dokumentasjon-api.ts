import api from "../../../utils/api.utils";

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
