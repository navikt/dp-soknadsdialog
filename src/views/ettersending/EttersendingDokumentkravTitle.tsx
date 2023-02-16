import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading, Tag } from "@navikt/ds-react";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { useSanity } from "../../context/sanity-context";
import styles from "./Ettersending.module.css";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";

type TagVariants = "warning" | "error" | "info" | "success";

export function EttersendingDokumentkravTitle(dokumentkrav: IDokumentkrav) {
  const { getAppText } = useSanity();
  const hasBundle = dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !!dokumentkrav.bundleFilsti;
  return (
    <div className={styles.dokumentkravTitleContainer}>
      <Heading level="3" size="small">
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
      </Heading>
      <Tag variant={getTagColor(hasBundle)}>{getAppText(getTagTextKey(hasBundle))}</Tag>
    </div>
  );
}

function getTagColor(hasBundle: boolean): TagVariants {
  if (hasBundle) {
    return "success";
  } else {
    return "warning";
  }
}

function getTagTextKey(hasBundle: boolean): string {
  if (hasBundle) {
    return "ettersending.dokumenter.status.mottatt";
  } else {
    return "ettersending.dokumenter.status.mangler";
  }
}
