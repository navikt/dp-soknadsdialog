import { Button } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isFaktumAnswered, isGeneratorFaktumAnswered } from "../../faktum.utils";
import { isGeneratorFaktum } from "../../sanity/type-guards";
import { RootState } from "../../store";
import { setSectionFaktumIndex } from "../../store/navigation.slice";
import { ISection } from "../../types/section.types";
import { Faktum } from "../faktum/Faktum";
import styles from "./Section.module.css";

interface Props {
  section: ISection;
  navigateNextSection: () => void;
  navigatePreviousSection: () => void;
}

export function Section(props: Props) {
  const dispatch = useDispatch();
  const [showNextSectionButton, setShowNextSectionButton] = useState(false);

  const answers = useSelector((state: RootState) => state.answers);
  const generators = useSelector((state: RootState) => state.generators);
  const navigationState = useSelector((state: RootState) => state.navigation);

  // Checking to handle sections where answers are optional
  useEffect(() => {
    showNextUnansweredFaktumOrNextSectionButton();
  }, [navigationState.currentSectionIndex]);

  // Listening to generators because answers for generator-faktum are stored there
  useEffect(() => {
    showNextUnansweredFaktumOrNextSectionButton();
  }, [answers, generators]);

  function showNextUnansweredFaktumOrNextSectionButton() {
    const allFaktaAnswered = props.section.fakta.every((faktum, index) => {
      let faktumAnswered;

      if (isGeneratorFaktum(faktum)) {
        faktumAnswered = isGeneratorFaktumAnswered(faktum, generators);
      } else {
        faktumAnswered = isFaktumAnswered(faktum, answers, generators);
      }

      if (faktumAnswered) {
        dispatch(setSectionFaktumIndex(index + 1));
      } else {
        dispatch(setSectionFaktumIndex(index));
      }

      return faktumAnswered;
    });

    if (allFaktaAnswered) {
      setShowNextSectionButton(true);
    } else {
      setShowNextSectionButton(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        <h1>{props.section.title ? props.section.title : props.section.id}</h1>
        {props.section.description && <PortableText value={props.section.description} />}
        {props.section.helpText && <p>{props.section.helpText}</p>}

        {props.section.fakta.map((faktum, index) => {
          if (index <= navigationState.sectionFaktumIndex) {
            return <Faktum key={faktum?.textId} faktum={faktum} />;
          }
        })}
      </div>
      <div>
        {showNextSectionButton && (
          <Button onClick={() => props.navigateNextSection()}>Neste seksjon</Button>
        )}
      </div>
      <div>
        <Button onClick={() => props.navigatePreviousSection()}>Forrige seksjon</Button>
      </div>
    </div>
  );
}
