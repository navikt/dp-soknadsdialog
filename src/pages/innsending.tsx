import { GetServerSidePropsContext } from "next";
import { audienceDPSoknad } from "../api.utils";
import { getSession } from "../auth.utils";
import { createInnsendingUuid } from "./api/quiz-api";
import ErrorPage from "./_error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      redirect: {
        destination: `/uuid-innsending/`,
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

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const innsendingUuidResponse = await createInnsendingUuid(onBehalfOfToken);

  if (innsendingUuidResponse.ok) {
    const innsendingUuid = await innsendingUuidResponse.text();

    if (innsendingUuid) {
      return {
        redirect: {
          destination: `/${innsendingUuid}/`,
          permanent: false,
        },
      };
    }
  }

  return {};
}

export default function Innsending() {
  // If everything went okay the user will be redirected. Return therefore error directly.
  return (
    <ErrorPage
      title="Det har skjedd en teknisk feil"
      details="Beklager, vi mistet kontakten med systemene våre."
    />
  );
}
