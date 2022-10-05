import { ErrorSummary } from "@navikt/ds-react";
import React, { PropsWithChildren, useEffect, useRef } from "react";

interface IProps {
  scrollWhen: boolean;
  heading: string;
}

interface IErrorListItem {
  id: string;
}

export function ErrorList(props: PropsWithChildren<IProps>) {
  const { heading, children, scrollWhen } = props;
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollWhen) {
      errorSummaryRef.current?.focus();
      errorSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollWhen]);

  return (
    <>
      <ErrorSummary size="medium" heading={heading} ref={errorSummaryRef}>
        {children}
      </ErrorSummary>
    </>
  );
}

export function ErrorListItem(props: PropsWithChildren<IErrorListItem>) {
  const { id, children } = props;

  return <ErrorSummary.Item href={`#${id}`}>{children}</ErrorSummary.Item>;
}
