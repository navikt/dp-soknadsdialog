import React from "react";
import { TextKeyValuePair } from "../../sanity/types";
import styles from "./Faktum.module.css";
import { FaktumBoolean } from "./FaktumBoolean";
import { FaktumMulti } from "./FaktumMulti";
import { Faktumtype } from "../../pages/api/types";

export interface IFaktum {
  _id: string;
  type: Faktumtype;
  title: TextKeyValuePair;
  description: TextKeyValuePair;
  help: TextKeyValuePair;
  alert: TextKeyValuePair;
  answers: IAnswer[];
  subFaktum?: ISubFaktum[];
}

export interface ISubFaktum extends Omit<IFaktum, "subFaktum"> {
  requiredAnswerId: string;
}

export interface IAnswer {
  _id: string;
  text: TextKeyValuePair;
  alertText?: TextKeyValuePair;
}

export interface FaktumAnswer {
  id: string;
  value: string;
}

export function Faktum(props: IFaktum) {
  return (
    <div className={styles.container}>
      {/*<h3>{props.title?.value}</h3>*/}
      {props.description && <p>{props.description.value}</p>}
      {props.help && <p>{props.help.value}</p>}
      {props.alert && <p>{props.alert.value}</p>}
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
