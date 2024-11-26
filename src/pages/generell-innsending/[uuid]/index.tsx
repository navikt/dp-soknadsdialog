import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockGenerellInnsending } from "../../../localhost-data/mock-generell-innsending";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IQuizState } from "../../../types/quiz.types";
import { erSoknadInnsendt } from "../../../utils/soknad.utils";
import { GenerellInnsending } from "../../../views/generell-innsending/GenerellInnsending";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { UserInfoProvider } from "../../../context/user-info-context";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import { AppProvider } from "../../../context/app-context";
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
        errorCode: null,
        dokumentkravList: null,
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
  let dokumentkravList = null;
  let soknadStatus = null;
  let orkestratorState = null;

  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, soknadOnBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, soknadOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(uuid, orkestratorOnBehalfOf.token);

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
      orkestratorState,
      dokumentkravList,
      errorCode,
    },
  };
}

export default function GenerellInnsendingPage(props: IProps) {
  const { soknadState, orkestratorState, dokumentkravList, errorCode } = props;

  if (errorCode || !soknadState || !dokumentkravList || !orkestratorState) {
    return (
      <ErrorPage
        title="Vi har tekniske problemer akkurat nå"
        details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <FeatureTogglesProvider featureToggles={{ soknadsdialogMedOrkestratorIsEnabled: false }}>
      <SoknadProvider quizState={soknadState}>
    <AppProvider>
      <SoknadProvider quizState={soknadState} orkestratorState={orkestratorState}>
        <UserInfoProvider arbeidsforhold={[]}>
          <DokumentkravProvider initialState={dokumentkravList}>
            <ValidationProvider>
              <GenerellInnsending />
            </ValidationProvider>
          </DokumentkravProvider>
        </UserInfoProvider>
      </SoknadProvider>
    </AppProvider>
  );
}
