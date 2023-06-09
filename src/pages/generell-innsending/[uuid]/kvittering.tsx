import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { GenerellInnsendingKvittering } from "../../../views/generell-innsending/GenerellInnsendingKvittering";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import ErrorPage from "../../_error";
import { mockGenerellInnsending } from "../../../localhost-data/mock-generell-innsending";
import { getSession } from "../../../auth.utils";
import { audienceDPSoknad } from "../../../api.utils";
import { getSoknadState } from "../../../api/quiz-api";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { QuizProvider } from "../../../context/quiz-context";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { ValidationProvider } from "../../../context/validation-context";
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
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);

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

  return {
    props: {
      soknadState,
      errorCode,
      dokumentkravList,
    },
  };
}

export default function GenerellInnsendingKvitteringPage(props: IProps) {
  const { soknadState, dokumentkravList, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkravList) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <QuizProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkravList}>
        <ValidationProvider>
          <GenerellInnsendingKvittering />
        </ValidationProvider>
      </DokumentkravProvider>
    </QuizProvider>
  );
}
