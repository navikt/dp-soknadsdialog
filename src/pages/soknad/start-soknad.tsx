import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { IMineSoknader } from "../../types/quiz.types";
import { getSoknadOnBehalfOfToken } from "../../utils/auth.utils";
import { StartSoknad } from "../../views/start-soknad/StartSoknad";
import { getMineSoknader } from "../api/common/quiz-api";
import { getFeatureToggles } from "../api/common/unleash-api";

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<object>> {
  const { locale } = context;

  const onBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  if (!onBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {},
    };
  }

  const featureToggles = await getFeatureToggles();
  const mineSoknaderResponse = await getMineSoknader(onBehalfOf.token);

  if (mineSoknaderResponse.ok) {
    const mineSoknader: IMineSoknader = await mineSoknaderResponse.json();

    if (mineSoknader?.paabegynt) {
      return {
        redirect: {
          destination: "/soknad",
          permanent: false,
        },
      };
    }
  }

  if (featureToggles.brukerdialogFrontendRelease === true) {
    return {
      redirect: {
        destination: process.env.BRUKERDIALOG_URL || "/soknad",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Soknad() {
  return <StartSoknad />;
}
