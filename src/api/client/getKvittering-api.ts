import api from "../../api.utils";

export async function getKvittering(
  uuid: string | string[] | undefined,
  locale: string | undefined
) {
  try {
    const res = await fetch(api(`/soknad/${uuid}/complete?locale=${locale}`));

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
