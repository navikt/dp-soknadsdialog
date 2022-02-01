import React from "react";
import { IFaktum } from "../../types/faktum.types";
import styles from "./Faktum.module.css";
import { FaktumBoolean } from "./FaktumBoolean";
import { FaktumMulti } from "./FaktumMulti";

export interface FaktumAnswer {
  id: string;
  value: string;
}

export function Faktum(props: IFaktum) {
  return (
    <div className={styles.container}>
      {props.title ? <h3>{props.title}</h3> : <h3>{props.id}.title</h3>}
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}
      {renderFaktumType(props)}
    </div>
  );
}

function renderFaktumType(props: IFaktum) {
  switch (props.type) {
    case "boolean":
      return <FaktumBoolean {...props} />;
    case "valg":
      return <FaktumBoolean {...props} />;
    case "flervalg":
      return <FaktumMulti {...props} />;
    default:
      return (
        <div>
          <b>MANGLER FAKTUM TYPE: {props.type}</b>
        </div>
      );
  }
}
