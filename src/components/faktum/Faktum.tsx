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
  answerOptions?: IAnswer[];
  subFaktum?: ISubFaktum[];
  faktum?: IFaktum[];
}

export interface ISubFaktum extends IFaktum {
  requiredAnswerIds: { _id: string }[];
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
      {props.title ? <h3>{props.title}</h3> : <h3>{props._id}.title</h3>}
      {props.description ? <p>{props.description}</p> : <p>{props._id}.description</p>}
      {props.help ? <p>{props.help}</p> : <p>{props._id}.help</p>}
      {props.alert ? <p>{props.alert}</p> : <p>{props._id}.alert</p>}
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
      return <div>MANGLER FAKTUM TYPE: {props.type}</div>;
  }
}
