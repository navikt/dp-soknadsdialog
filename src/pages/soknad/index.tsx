import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../utils/api.utils";
import {
  getArbeidsoekkerregisteretOnBehalfOfToken,
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../utils/auth.utils";
import { IMineSoknader, IOrkestratorSoknad } from "../../types/quiz.types";
import { Inngang } from "../../views/inngang/Inngang";
import ErrorPage from "../_error";
import {
  getArbeidssokerperioder,
  IArbeidssokerperioder,
  IArbeidssokerStatus,
} from "../api/common/arbeidssoker-api";
import { getMineSoknader } from "../api/common/quiz-api";
import { getOrkestratorSoknader } from "../api/common/orkestrator-api";
import { subDays } from "date-fns";

interface IProps {
  mineSoknader: IMineSoknader | null;
  orkestratorSoknader: IOrkestratorSoknad[] | null;
  arbeidssokerStatus: IArbeidssokerStatus;
  brukerdialogUrl: string;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
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
        orkestratorSoknader: null,
        arbeidssokerStatus: "REGISTERED",
        errorCode: null,
        brukerdialogUrl: "https://brukerdialog-dagpenger.ansatt.dev.nav.no",
      },
    };
  }

  const soknadObo = await getSoknadOnBehalfOfToken(context.req);
  const arbeidsoekerObo = await getArbeidsoekkerregisteretOnBehalfOfToken(context.req);
  const soknadOrkestratorObo = await getSoknadOrkestratorOnBehalfOfToken(context.req);

  if (!soknadObo.ok || !arbeidsoekerObo.ok || !soknadOrkestratorObo.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let mineSoknader = null;
  let orkestratorSoknader = null;
  let arbeidssokerStatus: IArbeidssokerStatus;
  let errorCode = null;
  const brukerdialogUrl = process.env.BRUKERDIALOG_URL || "https://brukerdialog-dagpenger.nav.no";

  const mineSoknaderResponse = await getMineSoknader(soknadObo.token);
  const orkestratorSoknaderResponse = await getOrkestratorSoknader(soknadOrkestratorObo.token);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(arbeidsoekerObo.token);

  if (!mineSoknaderResponse.ok) {
    const errorData = await getErrorDetails(mineSoknaderResponse);
    logger.error(`Inngang: ${errorData.status} error in mineSoknader - ${errorData.detail}`);
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
  }

  if (!orkestratorSoknaderResponse.ok) {
    const errorData = await getErrorDetails(orkestratorSoknaderResponse);
    logger.error(`Inngang: ${errorData.status} error in mineSoknader - ${errorData.detail}`);
    errorCode = orkestratorSoknaderResponse.status;
  } else {
    const within30Days = subDays(Date.now(), 30);
    const orkestratorSoknaderData: IOrkestratorSoknad[] = await orkestratorSoknaderResponse.json();

    orkestratorSoknader = orkestratorSoknaderData.filter(
      (soknad: IOrkestratorSoknad) => new Date(soknad.innsendtTimestamp) > within30Days,
    );
  }

  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder[] = await arbeidssokerStatusResponse.json();
    const isRegisteredAsArbeidsoker =
      data.findIndex((periode) => periode.avsluttet === null) !== -1;
    arbeidssokerStatus = isRegisteredAsArbeidsoker ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "ERROR";
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
      orkestratorSoknader,
      arbeidssokerStatus,
      errorCode,
      brukerdialogUrl,
    },
  };
}

export default function InngangPage(props: IProps) {
  const { errorCode, mineSoknader, arbeidssokerStatus, orkestratorSoknader, brukerdialogUrl } =
    props;

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
      orkestratorSoknader={orkestratorSoknader || []}
      brukerdialogUrl={brukerdialogUrl}
    />
  );
}
