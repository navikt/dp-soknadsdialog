import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { getErrorDetails } from "../../../utils/api.utils";
import {
  IArbeidssokerStatus,
  IArbeidssokerperioder,
  getArbeidssokerperioder,
} from "../../../api/arbeidssoker-api";
import { getSoknadState, getSoknadStatus } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { QuizProvider } from "../../../context/quiz-context";
import { ValidationProvider } from "../../../context/validation-context";
import { getMissingDokumentkrav } from "../../../utils/dokumentkrav.util";
import { IDokumentkravList } from "../../../types/documentation.types";
import { IPersonalia } from "../../../types/personalia.types";
import { IQuizState, ISoknadStatus } from "../../../types/quiz.types";
import { Receipt } from "../../../views/receipt/Receipt";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockPersonalia } from "../../../localhost-data/personalia";
import { getPersonalia } from "../../../api/personalia-api";

interface IProps {
  errorCode: number | null;
  soknadState: IQuizState | null;
  dokumentkrav: IDokumentkravList | null;
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
  personalia: IPersonalia | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        soknadState: mockNeste,
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
  let arbeidssokerStatus: IArbeidssokerStatus;
  let dokumentkrav: IDokumentkravList | null = null;
  let soknadStatus: ISoknadStatus = { status: "Ukjent" };
  let personalia = null;

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);
  const personaliaResponse = await getPersonalia(onBehalfOfToken);

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
    const data: IArbeidssokerperioder = await arbeidssokerStatusResponse.json();
    const currentArbeidssokerperiodeIndex = data.arbeidssokerperioder.findIndex(
      (periode) => periode.tilOgMedDato === null
    );

    arbeidssokerStatus = currentArbeidssokerperiodeIndex !== -1 ? "REGISTERED" : "UNREGISTERED";
  } else {
    arbeidssokerStatus = "UNKNOWN";
  }

  if (personaliaResponse.ok) {
    personalia = await personaliaResponse.json();
  }

  return {
    props: {
      soknadState,
      dokumentkrav,
      soknadStatus,
      personalia,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function ReceiptPage(props: IProps) {
  const { personalia, soknadState, soknadStatus, arbeidssokerStatus, errorCode, dokumentkrav } =
    props;

  if (!soknadState || !dokumentkrav) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <QuizProvider initialState={soknadState}>
      <DokumentkravProvider initialState={dokumentkrav}>
        <ValidationProvider>
          <Receipt
            soknadStatus={soknadStatus}
            arbeidssokerStatus={arbeidssokerStatus}
            sections={soknadState.seksjoner}
            personalia={personalia}
          />
        </ValidationProvider>
      </DokumentkravProvider>
    </QuizProvider>
  );
}
