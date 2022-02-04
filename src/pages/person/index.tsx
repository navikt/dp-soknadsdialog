import { Session, useSession } from "@navikt/dp-auth/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "@navikt/dp-auth/server";
import React from "react";
import { Personalia } from "../../types/personalia.types";
import useSWR from "swr";
import { host } from "../../api.utils";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token, payload } = await getSession(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/api/auth/signin?destination=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  // @ts-ignore payload er ikke undefined med token?
  const expires_in = Math.round(payload.exp - Date.now() / 1000);

  return {
    props: { session: { expires_in } },
  };
};

export default function Person({ session: initialSession }: Session): JSX.Element {
  const { session } = useSession({ initialSession });

  if (!session) {
    return <h4 style={{ marginTop: "1rem" }}>Ikke innlogget?</h4>;
  }
  return (
    <section>
      <Kontonummer />
    </section>
  );
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const Kontonummer = () => {
  const { data: personalia, error } = useSWR<Personalia>(`${host}/api/personalia`, fetcher);

  if (error) {
    return (
      <>
        <div>
          Feil:
          {JSON.stringify(error)}
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        Navn: {personalia?.forNavn}, {personalia?.etterNavn}
        {JSON.stringify(personalia)}
      </div>
    </>
  );
};
