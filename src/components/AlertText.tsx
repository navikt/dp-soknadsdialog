import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";

export function AlertText(props: SanityAlertText) {
  return (
    <Alert variant={props.type}>
      {props.title && <Heading size={"small"}> {props.title} </Heading>}
      <BodyLong>
        <PortableText value={props.body} />
      </BodyLong>
    </Alert>
  );
}
