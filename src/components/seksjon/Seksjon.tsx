import React, { useEffect, useState } from "react";
import styles from "./Seksjon.module.css";
import { ISection } from "../../types/section.types";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@navikt/ds-react";
import { SectionFaktum } from "../faktum/SectionFaktum";

interface Props {
  section: ISection;
  navigateNextSection: () => void;
  navigatePreviousSection: () => void;
}

export function Seksjon(props: Props) {
  const sectionFaktumIndex = useSelector((state: RootState) => state.navigation.sectionFaktumIndex);
  const [showNextSectionBtn, setShowNextSectionBtn] = useState(false);

  useEffect(() => {
    if (sectionFaktumIndex >= props.section.faktum.length) {
      setShowNextSectionBtn(true);
    } else {
      setShowNextSectionBtn(false);
    }
  }, [sectionFaktumIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        <h1>{props.section.title ? props.section.title : props.section.id}</h1>
        {props.section.description && <PortableText value={props.section.description} />}
        {props.section.helpText && <p>{props.section.helpText}</p>}

        {props.section.faktum.map((faktum, index) => {
          if (index <= sectionFaktumIndex) {
            return <SectionFaktum key={faktum?.textId} faktum={faktum} />;
          }
        })}
      </div>
      <div>
        {showNextSectionBtn && (
          <Button onClick={() => props.navigateNextSection()}>Neste seksjon</Button>
        )}
      </div>
      <div>
        {showNextSectionBtn && (
          <Button onClick={() => props.navigatePreviousSection()}>Forrige seksjon</Button>
        )}
      </div>
    </div>
  );
}
