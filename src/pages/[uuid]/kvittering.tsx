import React from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { allTextsQuery } from "../../sanity/groq-queries";
import { QuizProvider } from "../../context/quiz-context";
import { ISanityTexts } from "../../types/sanity.types";
import { audienceDPSoknad } from "../../api.utils";
import { getArbeidssokerStatus, getSoknadState, getSoknadTilstand } from "../api/quiz-api";
import { IQuizState } from "../../localhost-data/quiz-state-response";
import { getSession } from "@navikt/dp-auth/server";
import { SanityProvider } from "../../context/sanity-context";
import { Receipt } from "../../views/Receipt/Receipt";
import ErrorPage from "../_error";
import { getDokumentkrav } from "../api/documentation/[uuid]";
import { IDokumentkravList } from "../../types/documentation.types";
import { mockDokumentkravBesvart } from "../../localhost-data/mock-dokumentkrav-besvart";
import { mockNeste } from "../../localhost-data/mock-neste";
import { ISoknadStatus } from "../api/soknad/[uuid]/status";
import { IArbeidssokerStatus } from "../api/arbeidssoker";

interface IProps {
  errorCode: number | null;
  sanityTexts: ISanityTexts;
  soknadState: IQuizState | null;
  dokumentkrav: IDokumentkravList | null;
  soknadStatus: ISoknadStatus | null;
  arbeidssokerStatus: IArbeidssokerStatus | null;
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
        soknadState: mockNeste as unknown as IQuizState,
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
        soknadStatus: { tilstand: "Paabegynt" },
        arbeidssokerStatus: { isRegistered: false },
        errorCode: null,
      },
    };
  }

  const { token, apiToken } = await getSession(context);
  if (!token || !apiToken) {
    // TODO Redirect til hvilken login?
    return {
      redirect: {
        destination: "/TODO-redoratoren-login",
        permanent: false,
      },
    };
  }

  let errorCode = null;
  let soknadState = null;
  let soknadStatus = null;
  let dokumentkrav = null;
  let arbeidssokerStatus = null;
  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken);
  const soknadTilstandResponse = await getSoknadTilstand(uuid, onBehalfOfToken);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
  const arbeidssokerStatusResponse = await getArbeidssokerStatus(uuid, onBehalfOfToken);

  if (!soknadStateResponse.ok) {
    errorCode = soknadStateResponse.status;
  } else {
    soknadState = await soknadStateResponse.json();
  }

  if (!soknadTilstandResponse.ok) {
    errorCode = soknadTilstandResponse.status;
  } else {
    soknadStatus = await soknadTilstandResponse.json();
  }

  if (!dokumentkravResponse.ok) {
    errorCode = dokumentkravResponse.status;
  } else {
    dokumentkrav = await dokumentkravResponse.json();
  }

  if (!arbeidssokerStatusResponse.ok) {
    errorCode = arbeidssokerStatusResponse.status;
  } else {
    arbeidssokerStatus = await arbeidssokerStatusResponse.json();
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
  if (!props.soknadState) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre. Mangler søknad state"
        statusCode={props.errorCode || 500}
      />
    );
  }

  if (!props.dokumentkrav) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre. Mangler dokumentkrav"
        statusCode={props.errorCode || 500}
      />
    );
  }

  if (!props.soknadStatus) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre. Mangler soknadstatus"
        statusCode={props.errorCode || 500}
      />
    );
  }

  // if (!props.arbeidssokerStatus) {
  //   return (
  //     <ErrorPage
  //       title="Det har skjedd en teknisk feil"
  //       details="Beklager, vi mistet kontakten med systemene våre. Mangler arbeidssokerstatus"
  //       statusCode={props.errorCode || 500}
  //     />
  //   );
  // }

  if (!props.sanityTexts.seksjoner) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <QuizProvider initialState={props.soknadState}>
        <Receipt
          dokumentkravList={props.dokumentkrav}
          soknadStatus={props.soknadStatus}
          arbeidssokerStatus={props.arbeidssokerStatus || { isRegistered: false }}
        />
      </QuizProvider>
    </SanityProvider>
  );
}
