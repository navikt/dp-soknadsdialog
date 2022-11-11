import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorPageContent } from "../error-page-content/errorPageContent";

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
        <ErrorPageContent
          title="Vi har tekniske problemer akkurat nå"
          details="Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan
              prøve igjen om litt."
        />
      );
    }

    return this.props.children;
  }
}
