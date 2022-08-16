import { Alert, BodyShort, Detail } from "@navikt/ds-react";
import React from "react";

interface Props {
  variant: "error" | "warning" | "info" | "success";
  title: string;
  details: string;
}

export default function Error(props: Props) {
  const { variant, title, details } = props;
  return (
    <Alert variant={variant}>
      <BodyShort>{title}</BodyShort>
      <Detail>{details}</Detail>
    </Alert>
  );
}
