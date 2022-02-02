import React from "react";
import { IFaktum } from "../../types/faktum.types";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumGenerator } from "./FaktumGenerator";
import { FaktumDropdown } from "./FaktumDropdown";
import { FaktumDato } from "./FaktumDato";
import { FaktumPeriode } from "./FaktumPeriode";
import styles from "./Faktum.module.css";

export function Faktum(props: IFaktum) {
  return <div className={styles.container}>{renderFaktumType(props)}</div>;
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
    case "localdate":
      return <FaktumDato {...props} />;
    case "periode":
      return <FaktumPeriode {...props} />;
  }
}
