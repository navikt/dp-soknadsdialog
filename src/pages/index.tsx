import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { audienceDPSoknad } from "../api.utils";
import { IMineSoknader } from "../types/quiz.types";
import { Inngang } from "../views/Inngang";
import { getMineSoknader } from "./api/soknad/get-mine-soknader";
import ErrorPage from "./_error";
import { getSession } from "../auth.utils";

interface IProps {
  mineSoknader: IMineSoknader | null;
  errorCode: number | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        mineSoknader: {
          paabegynt: {
            soknadUuid: "localhost-uuid-paabegynt",
            opprettet: "2022-10-20T15:15:06.913514",
            sistEndretAvbruker: "2022-11-20T15:15:06.913514",
          },
          innsendte: [
            { soknadUuid: "localhost-uuid-innsendt-1", forstInnsendt: "2022-10-21T09:47:29" },
            { soknadUuid: "localhost-uuid-innsent-2", forstInnsendt: "2022-10-21T09:42:37" },
          ],
        },
        errorCode: null,
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

  let mineSoknader = null;
  let errorCode = null;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const mineSoknaderResponse = await getMineSoknader(onBehalfOfToken);

  if (!mineSoknaderResponse.ok) {
    errorCode = mineSoknaderResponse.status;
  } else {
    mineSoknader = await mineSoknaderResponse.json();
  }

  return {
    props: {
      mineSoknader,
      errorCode,
    },
  };
}

export default function InngangPage(props: IProps) {
  const { errorCode, mineSoknader } = props;

  if (errorCode) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }

  return <Inngang paabegynt={mineSoknader?.paabegynt} innsendte={mineSoknader?.innsendte} />;
}
