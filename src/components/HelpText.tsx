import { ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityHelpText } from "../types/sanity.types";

interface Props {
  helpText: SanityHelpText;
  className?: string;
}

export function HelpText(props: Props) {
  const { title, body } = props.helpText;

  return (
    <div className={props.className}>
      <ReadMore header={title}>
        <div>
          <PortableText value={body} />
        </div>
      </ReadMore>
    </div>
  );
}
