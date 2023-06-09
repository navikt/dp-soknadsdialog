import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { audienceDPSoknad, getErrorDetails } from "../../../api.utils";
import { getSoknadState, getSoknadStatus } from "../../../api/quiz-api";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { IDokumentkravList } from "../../../types/documentation.types";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import { Dokumentasjon } from "../../../views/dokumentasjon/Dokumentasjon";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import ErrorPage from "../../_error";
import { logger } from "@navikt/next-logger";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";

interface IProps {
  errorCode: number | null;
  soknadState: IQuizState | null;
  dokumentkrav: IDokumentkravList | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        soknadState: mockNeste,
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
  let dokumentkrav = null;
  let soknadStatus = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);

  if (!dokumentkravResponse.ok) {
    const errorData = await getErrorDetails(dokumentkravResponse);
    logger.error(
      `Dokumentasjon: ${errorData.status} error in dokumentkravList - ${errorData.detail}`
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
    <QuizProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <Dokumentasjon />
      </DokumentkravProvider>
    </QuizProvider>
  );
}
