import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { ErrorType, FileHandleState, IFileState } from "../../types/documentation.types";
import styles from "./FileItem.module.css";

export function FileItem(props: IFileState) {
  return (
    <li className={styles.fileItem}>
      <BodyShort size="medium">{props.name}</BodyShort>
      <BodyShort size="small">
        {props.state === FileHandleState.AwaitingUpload && <span>Laster opp</span>}
        {props.state === FileHandleState.Uploaded && <span>Ferdig opplastet</span>}
        {props.state === FileHandleState.Error && props.error === ErrorType.FileFormat && (
          <span>Feil format - ikke lastet opp</span>
        )}
        {props.state === FileHandleState.Error && props.error === ErrorType.FileSize && (
          <span>For stor fil - ikke lastet opp</span>
        )}
        {props.state === FileHandleState.Error && props.error === ErrorType.ServerError && (
          <span>Noe skjedde feil med opplastingen</span>
        )}
      </BodyShort>
    </li>
  );
}
