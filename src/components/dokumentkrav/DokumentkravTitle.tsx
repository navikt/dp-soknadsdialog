import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { findEmployerName } from "../../faktum.utils";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function DokumentkravTitle(props: IProps) {
  const { dokumentkrav } = props;

  const { getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  const employerName = findEmployerName(dokumentkrav.fakta);

  return (
    <>
      {dokumentkravText ? dokumentkravText.text : dokumentkrav.beskrivendeId}
      {employerName && ` (${employerName})`}
    </>
  );
}
