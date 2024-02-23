import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import {
  getArbeidssokerperioder,
  IArbeidssokerperioder,
  IArbeidssokerStatus,
} from "../../api/arbeidssoker-api";
import { getVeilarbregistreringOnBehalfOfToken } from "../../utils/auth.utils";
import { Arbeidssoker } from "../../views/arbeidssoker/Arbeidssoker";

interface IProps {
  arbeidssokerStatus: IArbeidssokerStatus;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        arbeidssokerStatus: "UNREGISTERED",
      },
    };
  }

  const onBehalfOf = await getVeilarbregistreringOnBehalfOfToken(context.req);
  if (!onBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(onBehalfOf.token);

  let arbeidssokerStatus: IArbeidssokerStatus;
  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.arbeidssokerperioder.findIndex(
      (periode) => periode.tilOgMedDato === null
    );

    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "UNKNOWN";
  }

  if (arbeidssokerStatus === "REGISTERED") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      arbeidssokerStatus,
    },
  };
}

export default function InngangPage(props: IProps) {
  return <Arbeidssoker arbeidssokerStatus={props.arbeidssokerStatus} />;
}
