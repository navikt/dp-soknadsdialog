import React from "react";
import { Button } from "@navikt/ds-react";
import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, BodyShort, Detail } from "@navikt/ds-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Alert variant="error">
            <BodyShort>Beklager, det skjedde en teknisk feil.</BodyShort>
            <Detail>
              Feilen blir automatisk rapportert og vi jobber med å løse den så raskt som mulig. Prøv
              igjen om litt.
            </Detail>
          </Alert>

          <Button
            variant="primary"
            size="medium"
            onClick={() => this.setState({ hasError: false })}
          >
            Prøv igjen
          </Button>
        </>
      );
    }

    return this.props.children;
  }
}
