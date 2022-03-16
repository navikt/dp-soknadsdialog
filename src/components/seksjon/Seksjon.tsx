import React from "react";
import styles from "./Seksjon.module.css";
import { Faktum } from "../faktum/Faktum";
import { ISection } from "../../types/section.types";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@navikt/ds-react";

export function Seksjon(props: ISection) {
  const answerIds = useSelector((state: RootState) => state.answers).map((answer) => answer.textId);
  const { visibleFaktumIds } = useSelector((state: RootState) => state.navigation);

  const sectionIsComplete = visibleFaktumIds.every((id) => answerIds.includes(id));

  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        <h1>{props.title ? props.title : props.id}</h1>
        {props.description && <PortableText value={props.description} />}
        {props.helpText && <p>{props.helpText}</p>}

        {props.faktum.map((faktum) => (
          <Faktum key={faktum?.textId} faktum={faktum} />
        ))}
      </div>
      <div>{sectionIsComplete && <Button>Neste seksjon</Button>}</div>
    </div>
  );
}
