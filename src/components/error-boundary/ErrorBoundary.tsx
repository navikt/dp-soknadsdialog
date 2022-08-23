import React from "react";
import { Button } from "@navikt/ds-react";
import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, BodyShort, Detail } from "@navikt/ds-react";
import styles from "./ErrorBoundary.module.css";

interface IProps {
  children?: ReactNode;
}

interface IState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IState {
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
            <BodyShort>Vi har tekniske problemer akkurat nå</BodyShort>
            <Detail>
              Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan
              prøve igjen om litt.
            </Detail>
            <BodyShort className={styles.statusCode}>Statuskode 500</BodyShort>
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
