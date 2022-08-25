import React from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { ErrorType, FileHandleState, IFileState } from "../../types/documentation.types";
import styles from "./FileItem.module.css";
import api from "../../api.utils";

export function FileItem(props: IFileState) {
  return (
    <li className={styles.fileItem}>
      <Link href={api(`/documentation/file/${props.fileId}/download`)} download={props.name}>
        <BodyShort size="medium">{props.name}</BodyShort>
      </Link>

      <BodyShort size="small">
        {props.state === FileHandleState.AwaitingUpload && <span>Laster opp</span>}
        {props.state === FileHandleState.Uploaded && <span>Ferdig opplastet</span>}
        {props.state === FileHandleState.Error && (
          <>
            {props.error === ErrorType.FileFormat && <span>Feil format - ikke lastet opp</span>}
            {props.error === ErrorType.FileSize && <span>For stor fil - ikke lastet opp</span>}
            {props.error === ErrorType.ServerError && (
              <span>Noe skjedde feil med opplastingen</span>
            )}
          </>
        )}
      </BodyShort>
    </li>
  );
}
