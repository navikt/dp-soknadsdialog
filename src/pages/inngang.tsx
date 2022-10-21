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
    mineSoknader = await mineSoknaderResponse.json();
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
  // if (props.errorCode || !props.mineSoknader) {
  if (props.errorCode) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={props.errorCode}
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
      {!props.mineSoknader && <p>Feil med henting av mine soknader</p>}
      {props.mineSoknader && <Inngang {...props.mineSoknader} />}
    </SanityProvider>
  );
}
