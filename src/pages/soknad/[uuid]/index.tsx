import React from "react";
import { Soknad } from "../../../views/soknad/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { audienceDPSoknad, getErrorDetails } from "../../../api.utils";
import { getSoknadState } from "../../../api/quiz-api";
import ErrorPage from "../../_error";
import { IPersonalia } from "../../../types/personalia.types";
import { getPersonalia } from "../../api/personalia";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import { logger } from "@navikt/next-logger";

interface IProps {
  soknadState: IQuizState | null;
  personalia: IPersonalia | null;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

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

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    const errorData = await getErrorDetails(soknadStateResponse);
    logger.error(`Soknad: ${errorData.status} error in soknadState - ${errorData.detail}`);
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (personaliaResponse.ok) {
    personalia = await personaliaResponse.json();
  }

  return {
    props: {
      soknadState,
      personalia,
      errorCode,
    },
  };
}

export default function SoknadPage(props: IProps) {
  const { errorCode, soknadState, personalia } = props;

  if (errorCode || !soknadState) {
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
      <ValidationProvider>
        <Soknad personalia={personalia} />
      </ValidationProvider>
    </QuizProvider>
  );
}
