import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { FeatureTogglesProvider } from "../../../context/feature-toggle-context";
import { QuizProvider } from "../../../context/quiz-context";
import {
  IArbeidsforhold,
  UserInformationProvider,
} from "../../../context/user-information-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { Soknad } from "../../../views/soknad/Soknad";
import ErrorPage from "../../_error";
import {
  defaultFeatureToggles,
  getFeatureToggles,
  IFeatureToggles,
} from "../../api/common/unleash-api";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import { getPersonalia } from "../../api/common/personalia-api";
import { getArbeidsforhold } from "../../api/common/arbeidsforhold-api";

interface IProps {
  soknadState: IQuizState | null;
  personalia: IPersonalia | null;
  errorCode: number | null;
  arbeidsforhold: IArbeidsforhold[];
  featureToggles: IFeatureToggles;
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
        featureToggles: {
          ...defaultFeatureToggles,
        },
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
  let soknadState = null;
  let personalia = null;
  let soknadStatus = null;
  let arbeidsforhold = [];

  const soknadStateResponse = await getSoknadState(uuid, onBehalfOf.token);
  const personaliaResponse = await getPersonalia(onBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOf.token);
  const featureToggles = await getFeatureToggles();
  const arbeidsforholdResponse = await getArbeidsforhold(onBehalfOf.token);

  if (arbeidsforholdResponse.ok) {
    arbeidsforhold = await arbeidsforholdResponse.json();
  }

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
      featureToggles,
    },
  };
}

export default function SoknadPage(props: IProps) {
  const { errorCode, soknadState, personalia, arbeidsforhold, featureToggles } = props;

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
      <FeatureTogglesProvider featureToggles={featureToggles}>
        <UserInformationProvider arbeidsforhold={arbeidsforhold}>
          <ValidationProvider>
            <Soknad personalia={personalia} />
          </ValidationProvider>
        </UserInformationProvider>
      </FeatureTogglesProvider>
    </QuizProvider>
  );
}
