import React from "react";
import { Summary } from "../../views/Summary";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../context/quiz-context";
import { audienceDPSoknad } from "../../api.utils";
import { getSoknadState } from "../api/quiz-api";
import ErrorPage from "../_error";
import { ValidationProvider } from "../../context/validation-context";
import { mockNeste } from "../../localhost-data/mock-neste";
import { IQuizState } from "../../types/quiz.types";
import { getSession } from "../../auth.utils";

interface IProps {
  soknadState: IQuizState | null;
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
  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  return {
    props: {
      soknadState,
      errorCode,
    },
  };
}

export default function SummaryPage(props: IProps) {
  if (props.errorCode || !props.soknadState) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode || 500}
      />
    );
  }
  return (
    <QuizProvider initialState={props.soknadState}>
      <ValidationProvider>
        <Summary sections={props.soknadState.seksjoner} />
      </ValidationProvider>
    </QuizProvider>
  );
}
