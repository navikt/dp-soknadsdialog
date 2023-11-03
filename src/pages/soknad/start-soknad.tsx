import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getMineSoknader } from "../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../auth.utils";
import { IMineSoknader } from "../../types/quiz.types";
import { StartSoknad } from "../../views/start-soknad/StartSoknad";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<object>> {
  const { locale } = context;

  const session = await getSession(context.req);
  if (!session) {
    return {
      redirect: {
        destination: locale ? `/oauth2/login?locale=${locale}` : "/oauth2/login",
        permanent: false,
      },
    };
  }

  if (process.env.USE_MOCKS) {
    return {
      props: {},
    };
  }

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);

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
