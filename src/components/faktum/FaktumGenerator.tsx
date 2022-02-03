import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Faktum } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumGenerator(props: IGeneratorFaktum) {
  return (
    <div>
      Generator type: {props.listType ? props.listType : "type ikke satt"}
      <div className={styles.generatorFaktumList}>
        {props.faktum?.map((faktum) => (
          <Faktum key={faktum.id} {...faktum} />
        ))}
      </div>
    </div>
  );
}
