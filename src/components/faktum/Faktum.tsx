import React from "react";
import styles from "./Faktum.module.css";
import { FaktumBoolean } from "./FaktumBoolean";
import { FaktumMulti } from "./FaktumMulti";
import { FaktumType } from "../../types/types";

export interface IFaktum {
  _id: string;
  type: FaktumType;
  title: string;
  description: string;
  help: string;
  alert: string;
  answers: IAnswer[];
  subFaktum?: ISubFaktum[];
}

export interface ISubFaktum extends Omit<IFaktum, "subFaktum"> {
  requiredAnswerId: string;
}

export interface IAnswer {
  _id: string;
  text: string;
  alertText?: string;
}

export interface FaktumAnswer {
  id: string;
  value: string;
}

export function Faktum(props: IFaktum) {
  return (
    <div className={styles.container}>
      {/*<h3>{props.title?.value}</h3>*/}
      {props.description && <p>{props.description}</p>}
      {props.help && <p>{props.help}</p>}
      {props.alert && <p>{props.alert}</p>}
      {renderFaktumType(props)}
    </div>
  );
}

function renderFaktumType(props: IFaktum) {
  switch (props.type) {
    case "boolean":
      return <FaktumBoolean {...props} />;
    case "flervalg":
      return <FaktumMulti {...props} />;
    case "localdate":
      return <div>MANGLER FAKTUM TYPE</div>;
  }
}
