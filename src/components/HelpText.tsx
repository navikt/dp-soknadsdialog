import { ReadMore } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { ISanityHelpText } from "../types/sanity.types";

interface IProps {
  helpText: ISanityHelpText;
  className?: string;
  defaultOpen?: boolean;
}

export function HelpText(props: IProps) {
  const { title, body } = props.helpText;

  return (
    <div className={props.className}>
      <ReadMore header={title} defaultOpen={props.defaultOpen}>
        <div>
          <PortableText value={body} />
        </div>
      </ReadMore>
    </div>
  );
}
