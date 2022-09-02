import React from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";

export function FileListItem(props: IDokumentkravFil) {
  return (
    <li className={styles.fileItem}>
      <Link href={api(`/documentation/file/${props.filsti}/download`)} download={props.filnavn}>
        <BodyShort size="medium">{props.filnavn}</BodyShort>
      </Link>
    </li>
  );
}
