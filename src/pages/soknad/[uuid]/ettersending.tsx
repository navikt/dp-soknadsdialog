import { Alert } from "@navikt/ds-react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { audienceDPSoknad, getErrorDetails } from "../../../api.utils";
import { getDokumentkrav } from "../../api/documentation/[uuid]";
import { IDokumentkravList } from "../../../types/documentation.types";
import { getSession } from "../../../auth.utils";
import { Ettersending } from "../../../views/ettersending/Ettersending";
import { mockDokumentkravBesvart } from "../../../localhost-data/mock-dokumentkrav-besvart";
import { DokumentkravProvider } from "../../../context/dokumentkrav-context";
import { logger } from "@navikt/next-logger";

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
    const errorData = await getErrorDetails(dokumentkravResponse);
    logger.error(errorData, "Ettersending: error in dokumentkravList");
    errorCode = dokumentkravResponse.status;
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
  const { dokumentkrav } = props;

  if (!dokumentkrav) {
    return <Alert variant="info">Ingen dokumentasjonskrav tilgjengelig på søknaden</Alert>;
  }

  return (
    <DokumentkravProvider initialState={dokumentkrav}>
      <Ettersending />
    </DokumentkravProvider>
  );
}
