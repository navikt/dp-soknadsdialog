import { Alert } from "@navikt/ds-react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { audienceDPSoknad } from "../../api.utils";
import { getSession } from "../../auth.utils";
import { mockDokumentkravBesvart } from "../../localhost-data/mock-dokumentkrav-besvart";
import { GET_DOKUMENTKRAV_ERROR } from "../../sentry-constants";
import { logFetchError } from "../../sentry.logger";
import { IDokumentkravList } from "../../types/documentation.types";
import { Ettersending } from "../../views/ettersending/Ettersending";
import { getDokumentkrav } from "../api/documentation/[uuid]";

interface IProps {
  errorCode: number | null;
  dokumentkrav: IDokumentkravList | null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { query, locale } = context;
  const uuid = query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return {
      props: {
        dokumentkrav: mockDokumentkravBesvart as IDokumentkravList,
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

  let errorCode = null;
  let dokumentkrav = null;
  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);

  if (!dokumentkravResponse.ok) {
    errorCode = dokumentkravResponse.status;
    logFetchError(GET_DOKUMENTKRAV_ERROR, uuid);
  } else {
    dokumentkrav = await dokumentkravResponse.json();
  }

  return {
    props: {
      dokumentkrav,
      errorCode,
    },
  };
}

export default function EttersendingPage(props: IProps) {
  if (!props.dokumentkrav) {
    return <Alert variant="info">Ingen dokumentasjonskrav tilgjengelig på søknaden</Alert>;
  }

  return <Ettersending dokumentkrav={props.dokumentkrav}></Ettersending>;
}
