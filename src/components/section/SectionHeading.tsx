import React from "react";
import { Heading, ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { SanitySeksjon } from "../../types/sanity.types";

interface Props {
  text: SanitySeksjon | undefined;
  fallback: string;
}

export function SectionHeading(props: Props) {
  return (
    <>
      <Heading spacing size="xlarge" level="2">
        {props.text?.title || props.fallback}
      </Heading>

      {props.text?.description && <PortableText value={props.text?.description} />}

      {props.text?.helpText && (
        <ReadMore header={props.text?.helpText.title}>
          <PortableText value={props.text?.helpText.body} />
        </ReadMore>
      )}
    </>
  );
}
