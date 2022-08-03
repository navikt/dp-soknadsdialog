import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";

interface Props {
  alertText: SanityAlertText;
  className?: string;
}

export function AlertText(props: Props) {
  const { type, title, body } = props.alertText;

  return (
    <div className={props.className}>
      <Alert variant={type}>
        {title && <Heading size={"small"}>{title} </Heading>}
        <PortableText value={body} />
      </Alert>
    </div>
  );
}
