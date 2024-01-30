import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../../utils/api.utils";
import { getSoknadState, getSoknadStatus } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Soknad } from "../../../views/soknad/Soknad";
import ErrorPage from "../../_error";
import { getPersonalia } from "../../../api/personalia-api";
import { getArbeidsforhold } from "../../../api/arbeidsforhold-api";
import { IArbeidsforhold } from "../../../components/arbeidsforhold/ArbeidsforholdList";
import { UserInformationProvider } from "../../../context/user-information-context";

interface IProps {
  soknadState: IQuizState | null;
  personalia: IPersonalia | null;
  errorCode: number | null;
  arbeidsforhold: IArbeidsforhold[];
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
        arbeidsforhold: [],
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
  let soknadStatus = null;
  let arbeidsforhold = [];

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);
  const arbeidsforholdResponse = await getArbeidsforhold(onBehalfOfToken);

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

  if (soknadStatusResponse.ok) {
    soknadStatus = await soknadStatusResponse.json();
  }

  if (arbeidsforholdResponse.ok) {
    arbeidsforhold = await arbeidsforholdResponse.json();
  }

  if (soknadStatus && erSoknadInnsendt(soknadStatus)) {
    return {
      redirect: {
        destination: `/soknad/${uuid}/kvittering`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      soknadState,
      personalia,
      errorCode,
      arbeidsforhold,
    },
  };
}

export default function SoknadPage(props: IProps) {
  const { errorCode, soknadState, personalia, arbeidsforhold } = props;

  if (errorCode || !soknadState || !arbeidsforhold) {
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
      <UserInformationProvider initialState={{ arbeidsforhold }}>
        <ValidationProvider>
          <Soknad personalia={personalia} />
        </ValidationProvider>
      </UserInformationProvider>
    </QuizProvider>
  );
}
