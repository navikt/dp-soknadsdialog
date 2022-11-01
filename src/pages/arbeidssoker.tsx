import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { audienceDPSoknad } from "../api.utils";
import { getArbeidssokerperioder, IArbeidssokerperioder } from "../api/arbeidssoker-api";
import { Arbeidssoker } from "../views/arbeidssoker/Arbeidssoker";
import { IArbeidssokerStatus } from "./api/arbeidssoker";
import { getMineSoknader } from "./api/soknad/get-mine-soknader";
import ErrorPage from "./_error";
import { getSession } from "../auth.utils";
import { deleteSoknad } from "../api/deleteSoknad-api";

interface IProps {
  arbeidssokerStatus: IArbeidssokerStatus;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        arbeidssokerStatus: "REGISTERED",
        errorCode: null,
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

  let mineSoknader = null;
  let arbeidssokerStatus: IArbeidssokerStatus;
  let errorCode = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);

  if (!mineSoknaderResponse.ok) {
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
  }

  if (!arbeidssokerStatusResponse.ok) {
    arbeidssokerStatus = "UNKNOWN";
  } else {
    const data: IArbeidssokerperioder = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.arbeidssokerperioder.findIndex(
      (periode) => periode.tilOgMedDato === null
    );
    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  }

  if (arbeidssokerStatusResponse.ok && mineSoknaderResponse.ok) {
    // Hvis brukeren er registert som arbeidssøker, men IKKE har en påbegynt søknad.
    // Redirect vi brukeren til /start-soknad.
    const paabegyntSoknadUuid = mineSoknader?.paabegynt?.soknadUuid;
    if (arbeidssokerStatus === "REGISTERED" && !paabegyntSoknadUuid) {
      return {
        redirect: {
          destination: "/start-soknad",
          permanent: false,
        },
      };
    }

    // Hvis brukeren er registert som arbeidssøker og HAR en påbegynt søknad.
    // (brukeren har trykket på Slett og start ny søknad fra /index.tsx og kom hit)
    // Slett søknad og redirect til /start-soknad.
    if (arbeidssokerStatus === "REGISTERED" && paabegyntSoknadUuid) {
      const deleteSoknadResponse = await deleteSoknad(paabegyntSoknadUuid);

      if (deleteSoknadResponse.ok) {
        return {
          redirect: {
            destination: "/start-soknad",
            permanent: false,
          },
        };
      } else {
        errorCode = deleteSoknadResponse.status;
      }
    }
  }

  return {
    props: {
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function InngangPage({ arbeidssokerStatus, errorCode }: IProps) {
  if (errorCode) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={500}
      />
    );
  }

  return <Arbeidssoker arbeidssokerStatus={arbeidssokerStatus} />;
}
