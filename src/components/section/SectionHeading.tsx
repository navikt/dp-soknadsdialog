import React from "react";
import { Heading, ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { ISanitySeksjon } from "../../types/sanity.types";

interface IProps {
  text: ISanitySeksjon | undefined;
  fallback: string;
}

export function SectionHeading(props: IProps) {
  return (
    <>
      <Heading spacing size="large" level="2">
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
