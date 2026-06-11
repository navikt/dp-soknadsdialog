import ErrorPage from "../_error";

export async function getServerSideProps() {
  const generellInnsendingUrl = process.env.GENERELL_INNSENDING_URL;

  if (process.env.USE_MOCKS === "true") {
    return {
      redirect: {
        destination: `/generell-innsending/uuid-innsending`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: generellInnsendingUrl,
        permanent: false,
      },
    };
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
