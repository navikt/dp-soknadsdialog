import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { ValidationProvider } from "../../../context/validation-context";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import { GenerellInnsendingKvittering } from "../../../views/generell-innsending/GenerellInnsendingKvittering";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { mockGenerellInnsending } from "../../../localhost-data/mock-generell-innsending";
import { getSoknadState } from "../../api/common/quiz-api";
import { IOrkestratorSoknad } from "../../../types/orkestrator.types";
import { getOrkestratorState } from "../../api/common/orkestrator-api";

interface IProps {
  soknadState: IQuizState | null;
  orkestratorState: IOrkestratorSoknad | null;
  errorCode: number | null;
  dokumentkravList: IDokumentkravList | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        soknadState: mockGenerellInnsending as IQuizState,
        orkestratorState: null,
        dokumentkravList: null,
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

  let errorCode = null;
  let orkestratorState = null;
  let soknadState = null;
  let dokumentkravList = null;

  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(uuid, orkestratorOnBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, soknadOnBehalfOf.token);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (orkestratorStateResponse.ok) {
    orkestratorState = await orkestratorStateResponse.json();
  } else {
    errorCode = orkestratorStateResponse.status;
  }

  if (!dokumentkravResponse.ok) {
    errorCode = dokumentkravResponse.status;
  } else {
    dokumentkravList = await dokumentkravResponse.json();
  }

  return {
    props: {
      soknadState,
      orkestratorState,
      errorCode,
      dokumentkravList,
    },
  };
}

export default function GenerellInnsendingKvitteringPage(props: IProps) {
  const { soknadState, orkestratorState, dokumentkravList, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkravList || !orkestratorState) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <SoknadProvider quizState={soknadState}>
      <DokumentkravProvider initialState={dokumentkravList}>
        <ValidationProvider>
          <GenerellInnsendingKvittering />
        </ValidationProvider>
      </DokumentkravProvider>
    </SoknadProvider>
  );
}
