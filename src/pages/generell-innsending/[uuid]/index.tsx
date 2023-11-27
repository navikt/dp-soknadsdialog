import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getSoknadState, getSoknadStatus } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../auth.utils";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockGenerellInnsending } from "../../../localhost-data/mock-generell-innsending";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { GenerellInnsending } from "../../../views/generell-innsending/GenerellInnsending";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";

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

  if (process.env.USE_MOCKS === "true") {
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
  let soknadStatus = null;

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (!dokumentkravResponse.ok) {
    errorCode = dokumentkravResponse.status;
  } else {
    dokumentkravList = await dokumentkravResponse.json();
  }

  if (soknadStatusResponse.ok) {
    soknadStatus = await soknadStatusResponse.json();
  }

  if (soknadStatus && erSoknadInnsendt(soknadStatus)) {
    return {
      redirect: {
        destination: `/generell-innsending/${uuid}/kvittering`,
        permanent: false,
      },
    };
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
