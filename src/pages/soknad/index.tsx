import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../api.utils";
import {
  IArbeidssokerStatus,
  IArbeidssokerperioder,
  getArbeidssokerperioder,
} from "../../api/arbeidssoker-api";
import { getMineSoknader } from "../../api/quiz-api";
import { getSession, getSoknadOboToken } from "../../auth.utils";
import { IMineSoknader } from "../../types/quiz.types";
import { Inngang } from "../../views/inngang/Inngang";
import ErrorPage from "../_error";

interface IProps {
  mineSoknader: IMineSoknader | null;
  arbeidssokerStatus: IArbeidssokerStatus;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

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

  const soknadOboToken = await getSoknadOboToken(session);
  const mineSoknaderResponse = await getMineSoknader(soknadOboToken);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);

  if (!mineSoknaderResponse.ok) {
    const errorData = await getErrorDetails(mineSoknaderResponse);
    logger.error(`Inngang: ${errorData.status} error in mineSoknader - ${errorData.detail}`);
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
  }

  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.arbeidssokerperioder.findIndex(
      (periode) => periode.tilOgMedDato === null
    );

    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "UNKNOWN";
  }

  if (mineSoknader && Object.keys(mineSoknader).length === 0) {
    return {
      redirect: {
        destination:
          arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker",
        permanent: false,
      },
    };
  }

  return {
    props: {
      mineSoknader,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function InngangPage(props: IProps) {
  const { errorCode, mineSoknader, arbeidssokerStatus } = props;

  if (errorCode) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <Inngang
      paabegynt={mineSoknader?.paabegynt}
      innsendte={mineSoknader?.innsendte}
      arbeidssokerStatus={arbeidssokerStatus}
    />
  );
}
