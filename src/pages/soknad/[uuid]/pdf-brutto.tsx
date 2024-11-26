import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { SoknadProvider } from "../../../context/soknad-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { Pdf } from "../../../views/pdf/Pdf";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { getSoknadState } from "../../api/common/quiz-api";
import { getPersonalia } from "../../api/common/personalia-api";
import { IOrkestratorSoknad } from "../../../types/orkestrator.types";
import { getOrkestratorState } from "../../api/common/orkestrator-api";

interface IProps {
  soknadState: IQuizState | null;
  orkestratorState: IOrkestratorSoknad | null;
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
        orkestratorState: null,
        personalia: mockPersonalia,
        dokumentkrav: mockDokumentkravBesvart,
        errorCode: null,
      },
    };
  }

  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(context.req);

  if (!soknadOnBehalfOf.ok || !orkestratorOnBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let soknadState = null;
  let personalia = null;
  let orkestratorState = null;
  let dokumentkrav = null;
  let errorCode = null;

  const personaliaResponse = await getPersonalia(soknadOnBehalfOf.token);
  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, soknadOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(uuid, orkestratorOnBehalfOf.token);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (!orkestratorStateResponse.ok) {
    errorCode = orkestratorStateResponse.status;
  } else {
    orkestratorState = await orkestratorStateResponse.json();
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
      orkestratorState,
      dokumentkrav,
      errorCode,
    },
  };
}

export default function PdfBruttoPage(props: IProps) {
  const { soknadState, orkestratorState, personalia, dokumentkrav, errorCode } = props;
  if (errorCode || !soknadState || !personalia || !dokumentkrav || !orkestratorState) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <SoknadProvider quizState={props.soknadState}>
      <ValidationProvider>
        <Pdf personalia={personalia} dokumentkravList={dokumentkrav} pdfView={"brutto"} />
      </ValidationProvider>
    </SoknadProvider>
  );
}
