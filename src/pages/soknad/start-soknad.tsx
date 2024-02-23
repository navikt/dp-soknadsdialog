import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getMineSoknader } from "../../api/quiz-api";
import { getSoknadOnBehalfOfToken } from "../../utils/auth.utils";
import { IMineSoknader } from "../../types/quiz.types";
import { StartSoknad } from "../../views/start-soknad/StartSoknad";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<object>> {
  const { locale } = context;

  if (process.env.USE_MOCKS === "true") {
    return {
      props: {},
    };
  }

  const onBehalfOf = await getSoknadOnBehalfOfToken(context.req);
  if (!onBehalfOf.ok) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }
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

  return {
    props: {},
  };
}

export default function Soknad() {
  return <StartSoknad />;
}
