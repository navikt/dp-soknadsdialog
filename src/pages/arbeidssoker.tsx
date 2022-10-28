import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../sanity-client";
import { audienceDPSoknad } from "../api.utils";
import { getArbeidssokerperioder, IArbeidssokerperioder } from "../api/arbeidssoker-api";
import { SanityProvider } from "../context/sanity-context";
import { allTextsQuery } from "../sanity/groq-queries";
import { IMineSoknader } from "../types/quiz.types";
import { ISanityTexts } from "../types/sanity.types";
import { Arbeidssoker } from "../views/arbeidssoker/Arbeidssoker";
import { IArbeidssokerStatus } from "./api/arbeidssoker";
import { getMineSoknader } from "./api/soknad/get-mine-soknader";
import ErrorPage from "./_error";
import { getSession } from "../auth.utils";

interface IProps {
  sanityTexts: ISanityTexts;
  mineSoknader: IMineSoknader | null;
  arbeidssokerStatus: IArbeidssokerStatus;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        sanityTexts,
        mineSoknader: {
          paabegynt: {
            soknadUuid: "localhost-uuid-paabegynt",
            opprettet: "2022-10-20T15:15:06.913514",
            sistEndretAvbruker: "2022-11-20T15:15:06.913514",
          },
          innsendte: [
            { soknadUuid: "localhost-uuid-innsendt-1", forstInnsendt: "2022-10-21T09:47:29" },
            { soknadUuid: "localhost-uuid-innsent-2", forstInnsendt: "2022-10-21T09:42:37" },
          ],
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

  let mineSoknader = null;
  let arbeidssokerStatus: IArbeidssokerStatus;
  let errorCode = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);
  const arbeidssokerStatusResponse = await getArbeidssokerperioder(context);

  if (!mineSoknaderResponse.ok) {
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
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
      mineSoknader,
      arbeidssokerStatus,
      errorCode,
    },
  };
}

export default function InngangPage({ sanityTexts, arbeidssokerStatus, mineSoknader }: IProps) {
  const soknadUuid = mineSoknader?.paabegynt?.soknadUuid;

  if (!soknadUuid) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={500}
      />
    );
  }

  if (!sanityTexts.seksjoner) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={500}
      />
    );
  }

  return (
    <SanityProvider initialState={sanityTexts}>
      <Arbeidssoker soknadUuid={soknadUuid} arbeidssokerStatus={arbeidssokerStatus} />
    </SanityProvider>
  );
}
