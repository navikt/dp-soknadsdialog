import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { audienceDPSoknad } from "../../../api.utils";
import { getSoknadState } from "../../../api/quiz-api";
import ErrorPage from "../../_error";
import { mockNeste } from "../../../__mocks__/mockdata/neste";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import { Pdf } from "../../../views/pdf/Pdf";
import { IPersonalia } from "../../../types/personalia.types";
import { mockPersonalia } from "../../../__mocks__/mockdata/personalia";
import { getPersonalia } from "../../api/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { mockDokumentkravBesvart } from "../../../__mocks__/mockdata/dokumentkrav-besvart";

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
        dokumentkrav: mockDokumentkravBesvart,
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
  let personalia = null;
  let soknadState = null;
  let dokumentkrav = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (dokumentkravResponse.ok) {
    dokumentkrav = await dokumentkravResponse.json();
  } else {
    errorCode = dokumentkravResponse.status;
  }

  if (personaliaResponse.ok) {
    personalia = await personaliaResponse.json();
  }

  return {
    props: {
      personalia,
      soknadState,
      dokumentkrav,
      errorCode,
    },
  };
}

export default function PdfBruttoPage(props: IProps) {
  if (props.errorCode || !props.soknadState || !props.personalia || !props.dokumentkrav) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <QuizProvider initialState={props.soknadState}>
      <ValidationProvider>
        <Pdf
          personalia={props.personalia}
          dokumentkravList={props.dokumentkrav}
          pdfView={"brutto"}
        />
      </ValidationProvider>
    </QuizProvider>
  );
}
