import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { FileState } from "../../types/documentation.types";
import styles from "./FileItem.module.css";

export function FileItem(props: FileState) {
  return (
    <li className={styles.fileItem}>
      <BodyShort size="medium">{props.name}</BodyShort>
      <BodyShort size="small">
        {props.state === "UPLOADING" && <span>Laster opp</span>}
        {props.state === "UPLOADED" && <span>Ferdig opplastet</span>}
        {props.state === "ERROR" && props.error === "FILE_FORMAT" && (
          <span>Feil format - ikke lastet opp</span>
        )}
        {props.state === "ERROR" && props.error === "FILE_SIZE" && (
          <span>For stor fil - ikke lastet opp</span>
        )}
        {props.state === "ERROR" && props.error === "SERVER_ERROR" && (
          <span>Noe skjedde feil med opplastingen</span>
        )}
      </BodyShort>
    </li>
  );
}
