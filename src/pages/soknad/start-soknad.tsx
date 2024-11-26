import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSoknadOnBehalfOfToken } from "../../utils/auth.utils";
import { IMineSoknader } from "../../types/quiz.types";
import { StartSoknad } from "../../views/start-soknad/StartSoknad";
import { getMineSoknader } from "../api/common/quiz-api";
import { getFeatureToggles, IFeatureToggles } from "../api/common/unleash-api";

import { AppProvider } from "../../context/app-context";
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
      props: {
        featureToggles: {
          soknadsdialogMedOrkestratorIsEnabled: false,
        },
      },
    };
  }

  const mineSoknaderResponse = await getMineSoknader(onBehalfOf.token);
  const featureToggles = await getFeatureToggles();

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

  return {
    props: { featureToggles },
  };
}

export default function Soknad(props: IProps) {
  return (
    <AppProvider featureToggles={props.featureToggles}>
      <StartSoknad />
    </AppProvider>
  );
}
