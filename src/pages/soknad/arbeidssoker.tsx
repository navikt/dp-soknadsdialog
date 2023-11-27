import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import {
  getArbeidssokerperioder,
  IArbeidssokerperioder,
  IArbeidssokerStatus,
} from "../../api/arbeidssoker-api";
import { getSession } from "../../utils/auth.utils";
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

  const session = await getSession(context.req);
  if (!session) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let arbeidssokerStatus: IArbeidssokerStatus;

  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);

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
