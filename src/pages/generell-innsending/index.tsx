import { GetServerSidePropsContext } from "next";
import { createInnsendingUuid } from "../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../utils/auth.utils";
import ErrorPage from "../_error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  if (process.env.USE_MOCKS === "true") {
    return {
      redirect: {
        destination: `/generell-innsending/uuid-innsending`,
        permanent: false,
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

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const innsendingUuidResponse = await createInnsendingUuid(onBehalfOfToken);

  if (innsendingUuidResponse.ok) {
    const innsendingUuid = await innsendingUuidResponse.text();

    if (innsendingUuid) {
      return {
        redirect: {
          destination: `/generell-innsending/${innsendingUuid}`,
          permanent: false,
        },
      };
    }
  }

  return {};
}

export default function GenerellInnsending() {
  // If everything went okay the user will be redirected. Return therefore error directly.
  return (
    <ErrorPage
      title="Det har skjedd en teknisk feil"
      details="Beklager, vi mistet kontakten med systemene våre."
    />
  );
}
