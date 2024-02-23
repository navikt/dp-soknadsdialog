import { formatISO } from "date-fns";
import { v4 as uuid } from "uuid";

export type IArbeidssokerStatus = "UNREGISTERED" | "REGISTERED" | "UNKNOWN";
export interface IArbeidssokerperioder {
  arbeidssokerperioder: [
    {
      fraOgMedDato: string;
      tilOgMedDato: string | null;
    },
  ];
}

export async function getArbeidssokerperioder(onBehalfOfToken: string) {
  const today = formatISO(new Date(), { representation: "date" });

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}/veilarbregistrering/api/arbeidssoker/perioder?fraOgMed=${today}`;

  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });
}
