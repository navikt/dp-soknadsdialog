import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../utils/api.utils";
import {
  IArbeidssokerStatus,
  IArbeidssokerperioder,
  getArbeidssokerperioder,
} from "../../api/arbeidssoker-api";
import { getMineSoknader } from "../../api/quiz-api";
import {
  getSoknadOnBehalfOfToken,
  getVeilarbregistreringOnBehalfOfToken,
} from "../../utils/auth.utils";
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

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        mineSoknader: {
          paabegynt: {
            soknadUuid: "localhost-uuid-paabegynt",
            opprettet: "2022-10-20T15:15:06.913514",
            sistEndretAvbruker: "2022-11-20T15:15:06.913514",
          },
          innsendte: [
            { soknadUuid: "localhost-uuid-innsendt-1", forstInnsendt: "2022-10-21T09:47:29" },
            { soknadUuid: "localhost-uuid-innsent-2", forstInnsendt: "2022-10-21T09:42:37" },
          ],
        },
        arbeidssokerStatus: "REGISTERED",
        errorCode: null,
      },
    };
  }

  let mineSoknader = null;
  let arbeidssokerStatus: IArbeidssokerStatus;
  let errorCode = null;

  const soknadObo = await getSoknadOnBehalfOfToken(context.req);
  const verilarbObo = await getVeilarbregistreringOnBehalfOfToken(context.req);
  if (!soknadObo.ok || !verilarbObo.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  const mineSoknaderResponse = await getMineSoknader(soknadObo.token);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(verilarbObo.token);

  if (!mineSoknaderResponse.ok) {
    const errorData = await getErrorDetails(mineSoknaderResponse);
    logger.error(`Inngang: ${errorData.status} error in mineSoknader - ${errorData.detail}`);
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
  }

  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder = await arbeidssokerStatusResponse.json();

    const isRegisteredAsArbeidsoker =
      data.arbeidssokerperioder.findIndex((periode) => periode.tilOgMedDato === null) !== -1;

    arbeidssokerStatus = isRegisteredAsArbeidsoker ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "UNKNOWN";
  }

  const userHasNoApplication = mineSoknader && Object.keys(mineSoknader).length === 0;
  if (userHasNoApplication) {
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
