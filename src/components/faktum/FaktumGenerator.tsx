import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barnetillegg } from "../barnetillegg/Barnetillegg";
import styles from "./Faktum.module.css";

export function FaktumGenerator(props: Omit<FaktumProps<IGeneratorFaktum>, "onChange">) {
  return <div>{renderListType(props.faktum)}</div>;
}

function renderListType(faktum: IGeneratorFaktum) {
  switch (faktum.listType) {
    case "Arbeidsforhold":
      return <Arbeidsforhold {...faktum} />;
    case "Barn":
      return <Barnetillegg {...faktum} />;
    case "Standard":
      return <StandardGeneratorFaktum {...faktum} />;
    default:
      return <TempFallback {...faktum} />;
  }
}

function TempFallback(faktum: IGeneratorFaktum) {
  return (
    <>
      Generator type: {faktum.listType ? faktum.listType : "type ikke satt"}
      <div className={styles["generator-faktum-list"]}>
        {/*TODO: Noen generator har ikke faktum array?*/}
        {faktum.faktum?.map((faktum) => (
          <Faktum key={faktum.beskrivendeId} faktum={faktum} />
        ))}
      </div>
    </>
  );
}

function StandardGeneratorFaktum(faktum: IGeneratorFaktum) {
  return <div>StandardGeneratorFaktum {faktum}</div>;
}
