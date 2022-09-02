import React from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";

export function FileListItem(props: IDokumentkravFil) {
  async function handleDownloadFile() {
    try {
      const response = await fetch(api(`/documentation/file/${props.filsti}/download`));
      // eslint-disable-next-line no-console
      console.log(response);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      // eslint-disable-next-line no-console
      console.log("blob: ", blob);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = props.filnavn;
      a.click();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  return (
    <li className={styles.fileItem}>
      <Link href={api(`/documentation/file/${props.filsti}/download`)} download={props.filnavn}>
        <BodyShort size="medium">{props.filnavn}</BodyShort>
      </Link>
      <button onClick={() => handleDownloadFile()}>Last ned</button>
    </li>
  );
}
