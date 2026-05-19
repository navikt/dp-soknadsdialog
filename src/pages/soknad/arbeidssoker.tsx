import { GetServerSidePropsResult } from "next/types";
import { Arbeidssoker } from "../../views/arbeidssoker/Arbeidssoker";
import { IArbeidssokerStatus } from "../api/common/arbeidssoker-api";

export interface IArbeidssokerProps {
  arbeidssokerStatus: IArbeidssokerStatus;
  arbeidssokerregistreringUrl: string | undefined;
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<IArbeidssokerProps>> {
  if (process.env.USE_MOCKS === "true") {
    return {
      props: {
        arbeidssokerStatus: "UNREGISTERED",
        arbeidssokerregistreringUrl: process.env.ARBEIDSSOKERREGISTRERING_URL,
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

export default function InngangPage(props: IArbeidssokerProps) {
  return (
    <Arbeidssoker
      arbeidssokerStatus={props.arbeidssokerStatus}
      arbeidssokerregistreringUrl={props.arbeidssokerregistreringUrl}
    />
  );
}
