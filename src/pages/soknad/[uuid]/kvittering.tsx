import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { SoknadProvider } from "../../../context/soknad-context";
import { ValidationProvider } from "../../../context/validation-context";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState, ISoknadStatus } from "../../../types/quiz.types";
import { getErrorDetails } from "../../../utils/api.utils";
import {
  getArbeidsoekkerregisteretOnBehalfOfToken,
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { getMissingDokumentkrav } from "../../../utils/dokumentkrav.util";
import { Receipt } from "../../../views/receipt/Receipt";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import {
  getArbeidssokerperioder,
  IArbeidssokerperioder,
  IArbeidssokerStatus,
} from "../../api/common/arbeidssoker-api";
import { getSoknadState, getSoknadStatus } from "../../api/common/quiz-api";
import { getPersonalia } from "../../api/common/personalia-api";
import { getOrkestratorState } from "../../api/common/orkestrator-api";
import { IOrkestratorSoknad } from "../../../types/orkestrator.types";

interface IProps {
  errorCode: number | null;
  soknadState: IQuizState | null;
  orkestratorState: IOrkestratorSoknad | null;
  dokumentkrav: IDokumentkravList | null;
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  personalia: IPersonalia | null;
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
        orkestratorState: null, // TODO: Fiks dette
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
        personalia: mockPersonalia,
        soknadStatus: {
          status: "UnderBehandling",
          opprettet: "2022-10-21T09:42:37.291157",
          innsendt: "2022-10-21T09:47:29",
        },
        arbeidssokerStatus: "UNREGISTERED",
        errorCode: null,
      },
    };
  }

  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  const arbeidssokerOnBehalfOf = await getArbeidsoekkerregisteretOnBehalfOfToken(context.req);
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(context.req);

  if (!soknadOnBehalfOf.ok || !arbeidssokerOnBehalfOf.ok || !orkestratorOnBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let errorCode = null;
  let soknadState = null;
  let arbeidssokerStatus: IArbeidssokerStatus;
  let dokumentkrav: IDokumentkravList | null = null;
  let soknadStatus: ISoknadStatus = { status: "Ukjent" };
  let personalia = null;
  let orkestratorState = null;

  const soknadStateResponse = await getSoknadState(uuid, soknadOnBehalfOf.token);
  const soknadStatusResponse = await getSoknadStatus(uuid, soknadOnBehalfOf.token);
  const dokumentkravResponse = await getDokumentkrav(uuid, soknadOnBehalfOf.token);
  const personaliaResponse = await getPersonalia(soknadOnBehalfOf.token);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(arbeidssokerOnBehalfOf.token);
  const orkestratorStateResponse = await getOrkestratorState(orkestratorOnBehalfOf.token, uuid);

  if (soknadStateResponse.ok) {
    soknadState = await soknadStateResponse.json();
  } else {
    const errorData = await getErrorDetails(soknadStateResponse);
    logger.error(`Kvittering: ${errorData.status} error in soknadState - ${errorData.detail}`);
    errorCode = soknadStateResponse.status;
  }

  if (dokumentkravResponse.ok) {
    dokumentkrav = await dokumentkravResponse.json();
  } else {
    const errorData = await getErrorDetails(dokumentkravResponse);
    logger.error(`Kvittering: ${errorData.status} error in dokumentkravList - ${errorData.detail}`);
    errorCode = dokumentkravResponse.status;
  }

  if (soknadStatusResponse.ok) {
    soknadStatus = await soknadStatusResponse.json();
  }

  if (soknadStatus.status === "Paabegynt") {
    return {
      redirect: {
        destination: `/soknad/${uuid}`,
        permanent: false,
      },
    };
  }

  const missingDocuments = dokumentkrav && getMissingDokumentkrav(dokumentkrav);

  if (missingDocuments && missingDocuments.length > 0) {
    soknadStatus.status = "ManglerDokumenter";
  }

  if (arbeidssokerStatusResponse.ok) {
    const data: IArbeidssokerperioder[] = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.findIndex((periode) => periode.avsluttet === null);
    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "ERROR";
  }

  if (personaliaResponse.ok) {
    personalia = await personaliaResponse.json();
  }

  if (orkestratorStateResponse.ok) {
    orkestratorState = await orkestratorStateResponse.json();
  }

  return {
    props: {
      soknadState,
      orkestratorState,
      dokumentkrav,
      soknadStatus,
      personalia,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function ReceiptPage(props: IProps) {
  const {
    personalia,
    soknadState,
    soknadStatus,
    arbeidssokerStatus,
    errorCode,
    dokumentkrav,
    orkestratorState,
  } = props;

  if (!soknadState || !orkestratorState || !dokumentkrav) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <SoknadProvider quizState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <ValidationProvider>
          <Receipt
            soknadStatus={soknadStatus}
            arbeidssokerStatus={arbeidssokerStatus}
            quizSections={soknadState.seksjoner}
            orkestratorSections={orkestratorState?.seksjoner}
            personalia={personalia}
          />
        </ValidationProvider>
      </DokumentkravProvider>
    </SoknadProvider>
  );
}
