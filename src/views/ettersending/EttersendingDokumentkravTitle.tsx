import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading, Tag } from "@navikt/ds-react";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { useSanity } from "../../context/sanity-context";
import styles from "./Ettersending.module.css";

type TagVariants = "warning" | "error" | "info" | "success";

export function EttersendingDokumentkravTitle(dokumentkrav: IDokumentkrav) {
  const { getAppText } = useSanity();
  return (
    <div className={styles.dokumentkravTitleContainer}>
      <Heading level="3" size="small">
        <DokumentkravTitle dokumentkrav={dokumentkrav} />
      </Heading>
      <Tag variant={getTagColor(dokumentkrav.bundleFilsti)}>
        {getAppText(getTagTextKey(dokumentkrav.bundleFilsti))}
      </Tag>
    </div>
  );
}

function getTagColor(bundleFilsti?: string): TagVariants {
  if (bundleFilsti) {
    return "success";
  } else {
    return "warning";
  }
}

function getTagTextKey(bundleFilsti?: string): string {
  if (bundleFilsti) {
    return "ettersending.dokumenter.status.mottatt";
  } else {
    return "ettersending.dokumenter.status.mangler";
  }
}
