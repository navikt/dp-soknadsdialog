import React from "react";
import { NextPageContext } from "next";
import { Alert, BodyShort, Detail } from "@navikt/ds-react";

interface IProps {
  variant: "error" | "warning" | "info" | "success";
  title: string;
  details: string;
  statusCode?: number;
}
export default function ErrorPage(props: IProps) {
  const { statusCode, variant, title, details } = props;

  // eslint-disable-next-line no-console
  console.log(statusCode);

  return (
    <Alert variant={variant}>
      <BodyShort>{title}</BodyShort>
      <Detail>{details}</Detail>
    </Alert>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
