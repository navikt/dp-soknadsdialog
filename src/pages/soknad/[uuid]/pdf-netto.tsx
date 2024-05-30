import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getPersonalia } from "../../../api/personalia-api";
import { getSoknadState } from "../../../api/quiz-api";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { Pdf } from "../../../views/pdf/Pdf";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";

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
        dokumentkrav: mockDokumentkravBesvart,
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
  let personalia = null;
  let soknadState = null;
  let dokumentkrav = null;

  const personaliaResponse = await getPersonalia(onBehalfOf.token);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOf.token);

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

export default function PdfNettoPage(props: IProps) {
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
          pdfView={"netto"}
        />
      </ValidationProvider>
    </QuizProvider>
  );
}
