import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../../api.utils";
import { getSoknadState, getSoknadStatus } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../auth.utils";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Summary } from "../../../views/summary/Summary";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { getPersonalia } from "../../api/personalia";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";

interface IProps {
  soknadState: IQuizState | null;
  personalia: IPersonalia | null;
  dokumentkrav: IDokumentkravList | null;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        soknadState: mockNeste,
        personalia: mockPersonalia,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
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

  let errorCode = null;
  let soknadState = null;
  let personalia = null;
  let dokumentkrav = null;
  let soknadStatus = null;

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);

  if (soknadStateResponse.ok) {
    soknadState = await soknadStateResponse.json();
  } else {
    const errorData = await getErrorDetails(soknadStateResponse);
    logger.error(`Oppsummering: ${errorData.status} error in soknadState - ${errorData.detail}`);
    errorCode = soknadStateResponse.status;
  }

  if (personaliaResponse.ok) {
    personalia = await personaliaResponse.json();
  }

  if (dokumentkravResponse.ok) {
    dokumentkrav = await dokumentkravResponse.json();
  } else {
    const errorData = await getErrorDetails(dokumentkravResponse);
    logger.error(
      `Oppsummering: ${errorData.status} error in dokumentkravList - ${errorData.detail}`
    );
    errorCode = dokumentkravResponse.status;
  }

  if (soknadStatusResponse.ok) {
    soknadStatus = await soknadStatusResponse.json();
  }

  if (soknadStatus && erSoknadInnsendt(soknadStatus)) {
    return {
      redirect: {
        destination: `/soknad/${uuid}/kvittering`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      soknadState,
      personalia,
      dokumentkrav,
      errorCode,
    },
  };
}

export default function SummaryPage(props: IProps) {
  const { errorCode, soknadState, personalia, dokumentkrav } = props;
  if (errorCode || !soknadState || !dokumentkrav) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }
  return (
    <QuizProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <ValidationProvider>
          <Summary personalia={personalia} />
        </ValidationProvider>
      </DokumentkravProvider>
    </QuizProvider>
  );
}
