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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
  const saveRequest = fetch(api(`/documentation/${uuid}/${dokumentkrav.id}/svar`), {
    method: "PUT",
    body: JSON.stringify(svar),
  });

  try {
    const res = await saveRequest;

    if (!res.ok) {
      throw Error(res.statusText);
    }

    return res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export async function saveDokumentkravFilToQuiz(
  uuid: string,
  dokumentkrav: IDokumentkrav,
  fil: IDokumentkravFil
) {
  const saveRequest = fetch(api(`/documentation/${uuid}/${dokumentkrav.id}/fil`), {
    method: "PUT",
    body: JSON.stringify(fil),
  });

  try {
    const res = await saveRequest;

    if (!res.ok) {
      throw Error(res.statusText);
    }

    return res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export async function saveDokumenkravFileToMellomLagring(
  file: File,
  uuid: string,
  dokumentkravId: string
) {
  const requestData = new FormData();
  requestData.append("file", file);
  const url = api(`/documentation/${uuid}/${dokumentkravId}/upload`);

  try {
    const response = await fetch(url, {
      method: "Post",
      headers: {
        accept: "application/json",
      },
      body: requestData,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
