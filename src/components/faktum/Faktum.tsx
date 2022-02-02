import React from "react";
import { IFaktum } from "../../types/faktum.types";
import styles from "./Faktum.module.css";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumGenerator } from "./FaktumGenerator";
import { FaktumDropdown } from "./FaktumDropdown";

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
      return <FaktumValg {...props} />;
    case "valg":
      return <FaktumValg {...props} />;
    case "flervalg":
      return <FaktumFlervalg {...props} />;
    case "tekst":
      return <FaktumText {...props} />;
    case "double":
      return <FaktumNumber {...props} />;
    case "int":
      return <FaktumNumber {...props} />;
    case "generator":
      return <FaktumGenerator {...props} />;
    case "dropdown":
      return <FaktumDropdown {...props} />;
    default:
      return (
        <div>
          <b>MANGLER FAKTUM TYPE: {props.type}</b>
        </div>
      );
  }
}
