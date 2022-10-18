import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function DokumentkravTitle(props: IProps) {
  const { dokumentkrav } = props;

  const { getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  const beskrivelse = dokumentkrav.beskrivelse;

  return (
    <>
      {dokumentkravText ? dokumentkravText.text : dokumentkrav.beskrivendeId}
      {beskrivelse && ` (${beskrivelse})`}
    </>
  );
}
