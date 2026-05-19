import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSoknadOnBehalfOfToken } from "../../utils/auth.utils";
import { StartSoknad } from "../../views/start-soknad/StartSoknad";

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

  return {
    redirect: {
      destination: `${process.env.BRUKERDIALOG_URL}/opprett-soknad`,
      permanent: false,
    },
  };
}

export default function Soknad() {
  return <StartSoknad />;
}
