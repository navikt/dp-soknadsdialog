import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Dokumentasjon } from "../../../views/dokumentasjon/Dokumentasjon";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";

interface IProps {
  errorCode: number | null;
  soknadState: IQuizState | null;
  dokumentkrav: IDokumentkravList | null;
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
  let dokumentkrav = null;
  let soknadStatus = null;

  const soknadStateResponse = await getSoknadState(uuid, onBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOf.token);

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
      dokumentkrav,
      errorCode,
    },
  };
}

export default function DocumentPage(props: IProps) {
  const { soknadState, dokumentkrav, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkrav) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <SoknadProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <Dokumentasjon />
      </DokumentkravProvider>
    </SoknadProvider>
  );
}
