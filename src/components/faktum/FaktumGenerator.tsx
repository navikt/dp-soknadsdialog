import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import styles from "./Faktum.module.css";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";

export function FaktumGenerator(props: Omit<FaktumProps<IGeneratorFaktum>, "onChange">) {
  return <div>{renderListType(props.faktum)}</div>;
}

function renderListType(faktum: IGeneratorFaktum) {
  switch (faktum.listType) {
    case "Arbeidsforhold":
      return <Arbeidsforhold {...faktum} />;
    case "Barn":
      return <TempFallback {...faktum} />;
    case "Standard":
      return <TempFallback {...faktum} />;
    default:
      return <TempFallback {...faktum} />;
  }
}

function TempFallback(faktum: IGeneratorFaktum) {
  return (
    <>
      Generator type: {faktum.listType ? faktum.listType : "type ikke satt"}
      <div className={styles["generator-faktum-list"]}>
        {faktum.faktum.map((faktum) => (
          <Faktum key={faktum.beskrivendeId} faktum={faktum} />
        ))}
      </div>
    </>
  );
}
