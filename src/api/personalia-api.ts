import api from "../api.utils";

export async function getPersonalia() {
  const url = api("/personalia");

  return await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
}
