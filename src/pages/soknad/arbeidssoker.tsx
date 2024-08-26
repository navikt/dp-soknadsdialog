import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import {
  IArbeidssokerStatus,
  IArbeidssokerperioder,
  getArbeidssokerperioder,
} from "../../api/arbeidssoker-api";
import { getArbeidsoekkerregisteretOnBehalfOfToken } from "../../utils/auth.utils";
import { Arbeidssoker } from "../../views/arbeidssoker/Arbeidssoker";

export interface IArbeidssokerProps {
  arbeidssokerStatus: IArbeidssokerStatus;
  arbeidssokerregistreringUrl: string | undefined;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IArbeidssokerProps>> {
  const { locale } = context;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        arbeidssokerStatus: "UNREGISTERED",
        arbeidssokerregistreringUrl: process.env.ARBEIDSSOKERREGISTRERING_URL,
      },
    };
  }

  const onBehalfOf = await getArbeidsoekkerregisteretOnBehalfOfToken(context.req);
  if (!onBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let arbeidssokerStatus: IArbeidssokerStatus;

  const arbeidssokerStatusResponse = await getArbeidssokerperioder(onBehalfOf.token);

  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder[] = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.findIndex((periode) => periode.avsluttet === null);
    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "ERROR";
  }

  if (arbeidssokerStatus === "REGISTERED") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  console.log(`🔥 arbeidssokerregistreringUrl :`, process.env.ARBEIDSSOKERREGISTRERING_URL);

  return {
    props: {
      arbeidssokerStatus,
      arbeidssokerregistreringUrl: process.env.ARBEIDSSOKERREGISTRERING_URL,
    },
  };
}

export default function InngangPage(props: IArbeidssokerProps) {
  return (
    <Arbeidssoker
      arbeidssokerStatus={props.arbeidssokerStatus}
      arbeidssokerregistreringUrl={props.arbeidssokerregistreringUrl}
    />
  );
}
