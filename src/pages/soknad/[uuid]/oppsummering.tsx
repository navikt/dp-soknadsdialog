import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Summary } from "../../../views/summary/Summary";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import { getPersonalia } from "../../api/common/personalia-api";

interface IProps {
  soknadState: IQuizState | null;
  personalia: IPersonalia | null;
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
        personalia: mockPersonalia,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
        errorCode: null,
      },
    };
  }

  const onBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  if (!onBehalfOf.ok) {
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

  const soknadStateResponse = await getSoknadState(uuid, onBehalfOf.token);
  const personaliaResponse = await getPersonalia(onBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOf.token);

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
      `Oppsummering: ${errorData.status} error in dokumentkravList - ${errorData.detail}`,
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
    <SoknadProvider quizState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <ValidationProvider>
          <Summary personalia={personalia} />
        </ValidationProvider>
      </DokumentkravProvider>
    </SoknadProvider>
  );
}
