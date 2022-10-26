import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../sanity-client";
import { SanityProvider } from "../context/sanity-context";
import { allTextsQuery } from "../sanity/groq-queries";
import { ISanityTexts } from "../types/sanity.types";
import { Arbeidssoker } from "../views/arbeidssoker/Arbeidssoker";
import ErrorPage from "./_error";
import { getSession } from "../auth.utils";

interface IProps {
  sanityTexts: ISanityTexts;
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
      },
    };
  }

  const { token, apiToken } = await getSession(context.req);
  if (!token || !apiToken) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sanityTexts,
    },
  };
}

export default function InngangPage(props: IProps) {
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
      <Arbeidssoker />
    </SanityProvider>
  );
}
