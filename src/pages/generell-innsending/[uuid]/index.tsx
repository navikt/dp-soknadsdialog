import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { audienceDPSoknad } from "../../../api.utils";
import { getSoknadState } from "../../../api/quiz-api";
import ErrorPage from "../../_error";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import { GenerellInnsending } from "../../../views/generell-innsending/GenerellInnsending";
import { mockGenerellInnsending } from "../../../__mocks__/mockdata/generell-innsending";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { IDokumentkravList } from "../../../types/documentation.types";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";

interface IProps {
  soknadState: IQuizState | null;
  errorCode: number | null;
  dokumentkravList: IDokumentkravList | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        soknadState: mockGenerellInnsending as IQuizState,
        errorCode: null,
        dokumentkravList: null,
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
  let dokumentkravList = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);

  if (!dokumentkravResponse.ok) {
    errorCode = dokumentkravResponse.status;
  } else {
    dokumentkravList = await dokumentkravResponse.json();
  }

  return {
    props: {
      soknadState,
      errorCode,
      dokumentkravList,
    },
  };
}

export default function GenerellInnsendingPage(props: IProps) {
  const { soknadState, dokumentkravList, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkravList) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <QuizProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkravList}>
        <ValidationProvider>
          <GenerellInnsending />
        </ValidationProvider>
      </DokumentkravProvider>
    </QuizProvider>
  );
}
