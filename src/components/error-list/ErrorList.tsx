import { ErrorSummary } from "@navikt/ds-react";
import React, { forwardRef, PropsWithChildren, Ref } from "react";

interface IProps {
  heading: string;
}

interface IErrorListItem {
  id: string;
}

function ErrorListComponent(props: PropsWithChildren<IProps>, ref: Ref<HTMLDivElement>) {
  const { heading, children } = props;

  return (
    <ErrorSummary size="medium" heading={heading} ref={ref}>
      {children}
    </ErrorSummary>
  );
}

export const ErrorList = forwardRef(ErrorListComponent);

export function ErrorListItem(props: PropsWithChildren<IErrorListItem>) {
  const { id, children } = props;

  return <ErrorSummary.Item href={`#${id}`}>{children}</ErrorSummary.Item>;
}
