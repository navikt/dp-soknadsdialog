import React from "react";
import { Heading, ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { ISanitySeksjon } from "../../types/sanity.types";

interface IProps {
  text: ISanitySeksjon | undefined;
  fallback: string;
  showAllTexts?: boolean;
}

export function SectionHeading(props: IProps) {
  const { text, fallback, showAllTexts = true } = props;
  return (
    <>
      <Heading spacing size="large" level="2">
        {text?.title || fallback}
      </Heading>

      {text?.description && showAllTexts && <PortableText value={text?.description} />}

      {text?.helpText && showAllTexts && (
        <ReadMore className="my-6" header={text?.helpText.title}>
          <PortableText value={text?.helpText.body} />
        </ReadMore>
      )}
    </>
  );
}
