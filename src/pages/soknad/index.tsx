import { GetServerSidePropsResult } from "next/types";
import { IMineSoknader, IOrkestratorSoknad } from "../../types/quiz.types";
import { Inngang } from "../../views/inngang/Inngang";
import ErrorPage from "../_error";
import { IArbeidssokerStatus } from "../api/common/arbeidssoker-api";

interface IProps {
  mineSoknader: IMineSoknader | null;
  orkestratorSoknader: IOrkestratorSoknad[] | null;
  arbeidssokerStatus: IArbeidssokerStatus;
  brukerdialogUrl: string;
  errorCode: number | null;
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<IProps>> {
  if (process.env.USE_MOCKS === "true") {
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
        orkestratorSoknader: null,
        arbeidssokerStatus: "REGISTERED",
        errorCode: null,
        brukerdialogUrl: "https://brukerdialog-dagpenger.ansatt.dev.nav.no",
      },
    };
  }

  return {
    redirect: {
      destination: `${process.env.BRUKERDIALOG_URL}/opprett-soknad`,
      permanent: false,
    },
  };
}

export default function InngangPage(props: IProps) {
  const { errorCode, mineSoknader, arbeidssokerStatus, orkestratorSoknader, brukerdialogUrl } =
    props;

  if (errorCode) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
        statusCode={errorCode || 500}
      />
    );
  }

  return (
    <Inngang
      paabegynt={mineSoknader?.paabegynt}
      innsendte={mineSoknader?.innsendte}
      arbeidssokerStatus={arbeidssokerStatus}
      orkestratorSoknader={orkestratorSoknader || []}
      brukerdialogUrl={brukerdialogUrl}
    />
  );
}
