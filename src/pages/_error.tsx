import React from "react";
import { NextPageContext } from "next";
import Error from "../components/error/Error";

interface Props {
  statusCode?: number;
}

export default function ErrorPage(props: Props) {
  const { statusCode } = props;
  return (
    <Error
      variant="error"
      title="Beklager, det skjedde en teknisk feil."
      details={
        statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"
      }
    />
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
