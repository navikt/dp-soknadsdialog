import api from "../../api.utils";

export async function getNesteFaktum(uuid: string | string[] | undefined, sistBesvart: string) {
  try {
    const res = await fetch(api(`/soknad/${uuid}/neste?sistLagret=${sistBesvart}`));

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
