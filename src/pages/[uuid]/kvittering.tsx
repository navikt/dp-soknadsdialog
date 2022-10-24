import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { ISanityTexts } from "../../types/sanity.types";
import { audienceDPSoknad } from "../../api.utils";
import { getSoknadState, getSoknadStatus } from "../api/quiz-api";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import { Receipt } from "../../views/receipt/Receipt";
import ErrorPage from "../_error";
import { getDokumentkrav } from "../api/documentation/[uuid]";
import { IDokumentkravList } from "../../types/documentation.types";
import { mockDokumentkravBesvart } from "../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../localhost-data/mock-neste";
import { ISoknadStatus } from "../api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../api/arbeidssoker";
import { getArbeidssokerperioder, IArbeidssokerperioder } from "../../api/arbeidssoker-api";
import { DokumentkravProvider } from "../../context/dokumentkrav-context";
import { ValidationProvider } from "../../context/validation-context";
import { IQuizState } from "../../types/quiz.types";

interface IProps {
  errorCode: number | null;
  sanityTexts: ISanityTexts;
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

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        sanityTexts,
        soknadState: mockNeste,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
        soknadStatus: {
          status: "Ukjent",
          opprettet: "2022-10-21T09:42:37.291157",
          innsendt: "2022-10-21T09:47:29",
        },
        arbeidssokerStatus: "UNREGISTERED",
        errorCode: null,
      },
    };
  }

  const { token, apiToken } = await getSession(context);
  if (!token || !apiToken) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  let errorCode = null;
  let soknadState = null;
  let dokumentkrav = null;
  let soknadStatus: ISoknadStatus;
  let arbeidssokerStatus: IArbeidssokerStatus;

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
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
  } else {
    soknadStatus = { status: "Ukjent" };
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
      sanityTexts,
      soknadState,
      dokumentkrav,
      soknadStatus,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function ReceiptPage(props: IProps) {
  if (
    !props.soknadState ||
    !props.dokumentkrav ||
    !props.arbeidssokerStatus ||
    !props.sanityTexts.seksjoner
  ) {
    // eslint-disable-next-line no-console
    !props.soknadState && console.error("Mangler soknadstate");
    // eslint-disable-next-line no-console
    !props.dokumentkrav && console.error("Mangler dokumentkrav");
    // eslint-disable-next-line no-console
    !props.soknadStatus && console.error("Mangler soknadStatus");
    // eslint-disable-next-line no-console
    !props.arbeidssokerStatus && console.error("Mangler arbeidssokerStatus");
    // eslint-disable-next-line no-console
    !props.sanityTexts.seksjoner && console.error("Mangler sanity tekster");
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode || 500}
      />
    );
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
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
    </SanityProvider>
  );
}
