import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { QuizProvider } from "../../../context/quiz-context";
import { audienceDPSoknad } from "../../../api.utils";
import { getSoknadState, getSoknadStatus } from "../../api/quiz-api";
import { Receipt } from "../../../views/receipt/Receipt";
import ErrorPage from "../../_error";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { IDokumentkravList } from "../../../types/documentation.types";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../../localhost-data/mock-neste";
import { ISoknadStatus } from "../../api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../../api/arbeidssoker";
import { getArbeidssokerperioder, IArbeidssokerperioder } from "../../../api/arbeidssoker-api";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { ValidationProvider } from "../../../context/validation-context";
import { IQuizState } from "../../../types/quiz.types";
import { getSession } from "../../../auth.utils";
import {
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
} from "../../../constants";

interface IProps {
  errorCode: number | null;
  soknadState: IQuizState | null;
  dokumentkrav: IDokumentkravList | null;
  soknadStatus: ISoknadStatus;
  arbeidssokerStatus: IArbeidssokerStatus;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        soknadState: mockNeste,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
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

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const soknadStatusResponse = await getSoknadStatus(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);

  if (soknadStateResponse.ok) {
    soknadState = await soknadStateResponse.json();
  } else {
    errorCode = soknadStateResponse.status;
  }

  if (dokumentkravResponse.ok) {
    dokumentkrav = await dokumentkravResponse.json();
  } else {
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

  const missingDocuments = dokumentkrav?.krav.filter(
    (dokumentkrav) =>
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE ||
      dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE
  );

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

  return {
    props: {
      soknadState,
      dokumentkrav,
      soknadStatus,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function ReceiptPage(props: IProps) {
  // eslint-disable-next-line no-console
  !props.soknadStatus && console.error("Mangler soknadStatus");
  // eslint-disable-next-line no-console
  !props.arbeidssokerStatus && console.error("Mangler arbeidssokerStatus");

  if (!props.soknadState || !props.dokumentkrav) {
    // eslint-disable-next-line no-console
    !props.soknadState && console.error("Mangler soknadstate");
    // eslint-disable-next-line no-console
    !props.dokumentkrav && console.error("Mangler dokumentkrav");
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <QuizProvider initialState={props.soknadState}>
      <DokumentkravProvider initialState={props.dokumentkrav}>
        <ValidationProvider>
          <Receipt
            soknadStatus={props.soknadStatus}
            arbeidssokerStatus={props.arbeidssokerStatus}
            sections={props.soknadState.seksjoner}
          />
        </ValidationProvider>
      </DokumentkravProvider>
    </QuizProvider>
  );
}
