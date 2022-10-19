import api from "../api.utils";

export async function deleteSoknad(uuid: string) {
  return fetch(api(`/soknad/delete`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid }),
  });
}
