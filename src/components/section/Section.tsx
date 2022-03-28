import React, { useEffect, useState } from "react";
import styles from "./Section.module.css";
import { ISection } from "../../types/section.types";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@navikt/ds-react";
import {
  isArrayEqual,
  isFaktumAnswered,
  isGeneratorFaktumAnswered,
  SectionFaktum,
} from "../faktum/SectionFaktum";
import { usePrevious } from "../../hooks/usePrevious";
import { isGeneratorFaktum } from "../../sanity/type-guards";

interface Props {
  section: ISection;
  navigateNextSection: () => void;
  navigatePreviousSection: () => void;
}

export function Section(props: Props) {
  const sectionFaktumIndex = useSelector((state: RootState) => state.navigation.sectionFaktumIndex);
  const [showNextSectionBtn, setShowNextSectionBtn] = useState(false);
  const answers = useSelector((state: RootState) => state.answers);
  const prevAnswers = usePrevious(answers) ?? answers;
  const generators = useSelector((state: RootState) => state.generators);
  const prevGenerators = usePrevious(generators) ?? generators;
  const currentSectionIndex = useSelector(
    (state: RootState) => state.navigation.currentSectionIndex
  );

  useEffect(() => {
    checkAllFaktaAnswered();
  }, [currentSectionIndex]);

  useEffect(() => {
    if (!isArrayEqual(answers, prevAnswers) || !isArrayEqual(generators, prevGenerators)) {
      checkAllFaktaAnswered();
    }
  }, [answers, generators]);

  function checkAllFaktaAnswered() {
    const allFaktaAnswered = props.section.faktum.every((faktum) => {
      if (isGeneratorFaktum(faktum)) {
        return isGeneratorFaktumAnswered(faktum, generators);
      }
      return isFaktumAnswered(faktum, answers, generators);
    });

    if (allFaktaAnswered) {
      setShowNextSectionBtn(true);
    } else {
      setShowNextSectionBtn(false);
    }
  }

  function navigateForward() {
    props.navigateNextSection();
    setShowNextSectionBtn(false);
  }

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
      <div>{showNextSectionBtn && <Button onClick={navigateForward}>Neste seksjon</Button>}</div>
      <div>
        {showNextSectionBtn && (
          <Button onClick={() => props.navigatePreviousSection()}>Forrige seksjon</Button>
        )}
      </div>
    </div>
  );
}
