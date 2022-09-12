import React from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { Component, ErrorInfo, ReactNode } from "react";
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

  gotoDittNav() {
    this.setState({ hasError: false });
    window.location.assign("https://www.nav.no/minside/");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <Heading level="1" size="xlarge">
            Vi har tekniske problemer akkurat nå
          </Heading>
          <BodyLong className={styles.body}>
            Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve
            igjen om litt.
          </BodyLong>
          <Button
            variant="primary"
            size="medium"
            onClick={() => this.gotoDittNav()}
            className={styles.actionButton}
          >
            Gå til Ditt NAV
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
