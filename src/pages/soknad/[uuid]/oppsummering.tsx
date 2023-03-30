import React from "react";
import { Summary } from "../../../views/summary/Summary";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { audienceDPSoknad, getErrorDetails } from "../../../api.utils";
import { getSoknadState } from "../../../api/quiz-api";
import ErrorPage from "../../_error";
import { ValidationProvider } from "../../../context/validation-context";
import { mockNeste } from "../../../__mocks__/mockdata/neste";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import { getPersonalia } from "../../api/personalia";
import { IPersonalia } from "../../../types/personalia.types";
import { mockPersonalia } from "../../../__mocks__/mockdata/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { mockDokumentkravBesvart } from "../../../__mocks__/mockdata/dokumentkrav-besvart";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { logger } from "@navikt/next-logger";

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

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
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

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);

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
