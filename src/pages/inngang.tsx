import { getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../sanity-client";
import { audienceDPSoknad } from "../api.utils";
import { SanityProvider } from "../context/sanity-context";
import { allTextsQuery } from "../sanity/groq-queries";
import { ISanityTexts } from "../types/sanity.types";
import { IMineSoknader } from "../types/quiz.types";
import { Inngang } from "../views/Inngang";
import { getMineSoknader } from "./api/soknad/get-mine-soknader";
import ErrorPage from "./_error";

interface IProps {
  sanityTexts: ISanityTexts;
  mineSoknader: IMineSoknader | null;
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
          paabegynt: { uuid: "localhost-uuid-paabegynt", startDato: "2021-10-03" },
          innsendte: [
            { uuid: "localhost-uuid-innsendt-1", forstInnsendt: "2021-10-00" },
            { uuid: "localhost-uuid-innsent-2", forstInnsendt: "2021-11-11" },
          ],
        },
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

  let mineSoknader = null;
  let errorCode = null;

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);

  if (!mineSoknaderResponse.ok) {
    errorCode = mineSoknaderResponse.status;
  } else {
    // eslint-disable-next-line no-console
    console.log("mine søknader response statuas: ", mineSoknaderResponse.status);
    // eslint-disable-next-line no-console
    console.log("mine søknader response status text: ", mineSoknaderResponse.statusText);

    mineSoknader = await mineSoknaderResponse.json();
    // eslint-disable-next-line no-console
    console.log("mine søknader soknader props: ", mineSoknader);
  }

  return {
    props: {
      sanityTexts,
      mineSoknader,
      errorCode,
    },
  };
}

export default function InngangPage(props: IProps) {
  if (props.errorCode || !props.mineSoknader) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode || 500}
      />
    );
  }

  if (!props.sanityTexts.seksjoner) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={500}
      />
    );
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <Inngang {...props.mineSoknader} />
    </SanityProvider>
  );
}
