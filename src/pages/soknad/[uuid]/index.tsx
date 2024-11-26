import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { FeatureTogglesProvider } from "../../../context/feature-toggle-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { IArbeidsforhold, UserInfoProvider } from "../../../context/user-info-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState, ISoknadStatus } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
// import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { AppProvider } from "../../../context/app-context";
import { ILandgruppe, IOrkestratorSoknad } from "../../../types/orkestrator.types";
import { Soknad } from "../../../views/soknad/Soknad";
import ErrorPage from "../../_error";
import { getArbeidsforhold } from "../../api/common/arbeidsforhold-api";
import { getLandgrupper, getOrkestratorState } from "../../api/common/orkestrator-api";
import { getPersonalia } from "../../api/common/personalia-api";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import {
  defaultFeatureToggles,
  getFeatureToggles,
  IFeatureToggles,
} from "../../api/common/unleash-api";

interface IProps {
  soknadState: IQuizState | null;
  soknadStatus: ISoknadStatus | null;
  orkestratorState: IOrkestratorSoknad | null;
  personalia: IPersonalia | null;
  errorCode: number | null;
  arbeidsforhold: IArbeidsforhold[];
  featureToggles: IFeatureToggles;
  landgrupper: ILandgruppe[] | null;
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
        arbeidsforhold: [],
        errorCode: null,
        soknadStatus: null,
        landgrupper: null,
        featureToggles: {
          ...defaultFeatureToggles,
        },
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
  let soknadState = null;
  let orkestratorState = null;
  let personalia = null;
  let soknadStatus = null;
  let arbeidsforhold = [];
  let landgrupper = null;

  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(orkestratorOnBehalfOf.token, uuid);
  const personaliaResponse = await getPersonalia(soknadOnBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, soknadOnBehalfOf.token);
  const featureToggles = await getFeatureToggles();
  const arbeidsforholdResponse = await getArbeidsforhold(soknadOnBehalfOf.token);
  const landgrupperResponse = await getLandgrupper();

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

  if (orkestratorStateResponse.ok) {
    orkestratorState = await orkestratorStateResponse.json();
  }

  if (landgrupperResponse.ok) {
    landgrupper = await landgrupperResponse.json();
  }

  // TODO: Ser på den her også
  // Når orkestrator er fullført og søknadstate er også fullført blir man redirect til kvittering siden
  // if (soknadStatus && erSoknadInnsendt(soknadStatus)) {
  //   return {
  //     redirect: {
  //       destination: `/soknad/${uuid}/kvittering`,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      soknadState,
      soknadStatus,
      orkestratorState,
      personalia,
      errorCode,
      arbeidsforhold,
      featureToggles,
      landgrupper,
    },
  };
}

export default function SoknadPage(props: IProps) {
  const {
    errorCode,
    soknadState,
    personalia,
    arbeidsforhold,
    orkestratorState,
    featureToggles,
    landgrupper,
  } = props;

  if (errorCode || !soknadState || !arbeidsforhold || !orkestratorState || !landgrupper) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <AppProvider featureToggles={featureToggles} landgrupper={landgrupper}>
      <SoknadProvider quizState={soknadState} orkestratorState={orkestratorState}>
        <UserInfoProvider arbeidsforhold={arbeidsforhold}>
          <ValidationProvider>
            <Soknad personalia={personalia} />
          </ValidationProvider>
        </UserInfoProvider>
      </SoknadProvider>
    </AppProvider>
  );
}
