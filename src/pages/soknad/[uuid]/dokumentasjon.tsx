import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Dokumentasjon } from "../../../views/dokumentasjon/Dokumentasjon";
import ErrorPage from "../../_error";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import { IOrkestratorSoknad } from "../../../types/orkestrator.types";
import { getOrkestratorState } from "../../api/common/orkestrator-api";
import { getDokumentkrav } from "../../api/documentation/[uuid]";

interface IProps {
  soknadState: IQuizState | null;
  orkestratorState: IOrkestratorSoknad | null;
  dokumentkrav: IDokumentkravList | null;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        soknadState: mockNeste,
        orkestratorState: null,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
        errorCode: null,
      },
    };
  }

  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(context.req);

  if (!soknadOnBehalfOf.ok || !orkestratorOnBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let soknadState = null;
  let orkestratorState = null;
  let soknadStatus = null;
  let dokumentkrav = null;
  let errorCode = null;

  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(uuid, orkestratorOnBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, soknadOnBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, soknadOnBehalfOf.token);

  if (!dokumentkravResponse.ok) {
    const errorData = await getErrorDetails(dokumentkravResponse);
    logger.error(
      `Dokumentasjon: ${errorData.status} error in dokumentkravList - ${errorData.detail}`,
    );
    errorCode = dokumentkravResponse.status;
  } else {
    dokumentkrav = await dokumentkravResponse.json();
  }

  if (dokumentkrav?.krav.length === 0) {
    return {
      redirect: {
        destination: `/soknad/${uuid}/oppsummering`,
        permanent: false,
      },
    };
  }

  if (soknadStatusResponse.ok) {
    soknadStatus = await soknadStatusResponse.json();
  }

  if (orkestratorStateResponse.ok) {
    orkestratorState = await orkestratorStateResponse.json();
  } else {
    errorCode = orkestratorStateResponse.status;
  }

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (soknadStatus && erSoknadInnsendt(soknadStatus)) {
    return {
      redirect: {
        destination: `/soknad/${uuid}/kvittering`,
        permanent: false,
      },
    };
  }

  if (!soknadStateResponse.ok) {
    const errorData = await getErrorDetails(soknadStateResponse);
    logger.error(`Dokumentasjon: ${errorData.status} error in soknadState - ${errorData.detail}`);
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  return {
    props: {
      soknadState,
      orkestratorState,
      dokumentkrav,
      errorCode,
    },
  };
}

export default function DocumentPage(props: IProps) {
  const { soknadState, orkestratorState, dokumentkrav, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkrav || !orkestratorState) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <SoknadProvider quizState={soknadState} orkestratorState={orkestratorState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <Dokumentasjon />
      </DokumentkravProvider>
    </SoknadProvider>
  );
}
