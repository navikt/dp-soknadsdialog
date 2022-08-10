import React from "react";
import { NextPageContext } from "next";
import Error from "../components/error/Error";

export default function ErrorPage() {
  return (
    <Error
      variant="error"
      title="Beklager, det skjedde en teknisk feil."
      details="Feilen blir automatisk rapportert og vi jobber med å løse den så raskt som mulig. Prøv igjen
        om litt."
    />
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
