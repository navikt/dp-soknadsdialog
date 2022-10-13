import { ErrorMessage } from "@navikt/ds-react";
import styles from "./ValidationMessage.module.css";

interface IValidationMessage {
  message: string;
}

export function ValidationMessage({ message }: IValidationMessage) {
  return <ErrorMessage className={styles.faktumValidationMessage}>{message}</ErrorMessage>;
}
