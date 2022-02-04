import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumGenerator(props: Omit<FaktumProps<IGeneratorFaktum>, "onChange">) {
  const { faktum } = props;
  return (
    <div>
      Generator type: {faktum.listType ? faktum.listType : "type ikke satt"}
      <div className={styles["generator-faktum-list"]}>
        {faktum.faktum?.map((faktum) => (
          <Faktum key={faktum.id} {...faktum} />
        ))}
      </div>
    </div>
  );
}
