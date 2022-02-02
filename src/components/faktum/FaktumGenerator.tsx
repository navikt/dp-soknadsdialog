import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Faktum } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumGenerator(props: IGeneratorFaktum) {
  return (
    <div>
      Generator type: {props.listType}
      <div className={styles["generator-faktum-list"]}>
        {props.faktum?.map((faktum) => (
          <Faktum key={faktum.id} {...faktum} />
        ))}
      </div>
    </div>
  );
}
