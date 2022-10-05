import { v4 as uuid } from "uuid";
import { getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext } from "next/types";
import { formatISO } from "date-fns";

const periodeFormatter = new Intl.DateTimeFormat("no", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formaterDato(date: Date) {
  return periodeFormatter.format(date).split(".").reverse().join("-");
}

export async function getArbeidssokerStatus({ req }: GetServerSidePropsContext) {
  // eslint-disable-next-line no-console
  console.log(formaterDato(new Date()));

  const newDate = new Date();
  const oldFormat = formaterDato(newDate);
  const newFormat = formatISO(newDate, { representation: "date" });

  // eslint-disable-next-line no-console
  console.log("oldFormat: ", oldFormat);
  // eslint-disable-next-line no-console
  console.log("newFormat: ", newFormat);

  const { payload } = await getSession({ req });
  const idtoken = req.cookies["selvbetjening-idtoken"];

  const callId = uuid();
  const url = `${process.env.VEILARBPROXY_URL}?fnr=${payload?.pid}&fraOgMed=${oldFormat}`;

  // eslint-disable-next-line no-console
  console.log("getArbeidssokerStatus() URL: ", url);

  const response = await fetch(url.toString(), {
    headers: {
      cookie: `selvbetjening-idtoken=${idtoken}`,
      "Nav-Consumer-Id": "dp-soknadsdialog",
      "Nav-Call-Id": callId,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Response: ", response);

  return response;
}
