import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";

interface Props {
  alertText: SanityAlertText;
}

export function AlertText(props: Props) {
  const { type, title, body } = props.alertText;

  return (
    <Alert variant={type}>
      {title && <Heading size={"small"}>{title} </Heading>}
      <PortableText value={body} />
    </Alert>
  );
}
