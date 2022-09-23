import { ErrorSummary } from "@navikt/ds-react";
import React, { PropsWithChildren, useEffect, useRef } from "react";

interface IProps {
  showWhen: boolean;
  heading: string;
}

interface IErrorListItem {
  id: string;
}

export function ErrorList(props: PropsWithChildren<IProps>) {
  const { showWhen, heading, children } = props;
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showWhen) {
      errorSummaryRef.current?.focus();
      errorSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showWhen]);

  return (
    <>
      {showWhen && (
        <ErrorSummary size="medium" heading={heading} ref={errorSummaryRef}>
          {children}
        </ErrorSummary>
      )}
    </>
  );
}

export function ErrorListItem(props: PropsWithChildren<IErrorListItem>) {
  const { id, children } = props;

  return <ErrorSummary.Item href={`#${id}`}>{children}</ErrorSummary.Item>;
}
