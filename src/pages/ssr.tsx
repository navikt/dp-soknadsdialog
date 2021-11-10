import { getSession } from "@navikt/dp-auth/server";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token, payload } = await getSession(context);

  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }


  const fnr = payload.pid as string;

  return {
    props: {
      fnr
    },
  };
};

export default function Ssr({ fnr }): JSX.Element {
  return (
    <>
      <h1>Bruker er innlogga</h1>
      <ul>
        <li>Bruker fnr: {fnr}</li>
      </ul>
    </>
  );
}
