import { Button } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isFaktumAnswered, isGeneratorFaktumAnswered } from "../../faktum.utils";
import { isGeneratorFaktum } from "../../sanity/type-guards";
import { RootState } from "../../store";
import { setSectionFaktumIndex } from "../../store/sections.slice";
import { ISection } from "../../types/section.types";
import { Faktum } from "../faktum/Faktum";
import styles from "./Section.module.css";
import { Left, Right } from "@navikt/ds-icons";
import { IDescription } from "../../types/faktum.types";
import { isBackwardNavigationPossible } from "../../store/sections.slice";

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
  const currentSectionIndex = useSelector(
    (state: RootState) => state.sectionsState.currentSectionIndex
  );
  const sectionFaktumIndex = useSelector(
    (state: RootState) => state.sectionsState.sectionFaktumIndex
  );

  const isBackNavigationPossible = useSelector(isBackwardNavigationPossible);

  // Checking to handle sections where answers are optional
  useEffect(() => {
    showNextUnansweredFaktumOrNextSectionButton();
  }, [currentSectionIndex]);

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

  function renderSectionDescription(description?: IDescription) {
    if (!description) return null;
    return (
      <div className={styles.sectionDescription}>
        <PortableText value={description} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.rootFaktum}>
        <h1>{props.section.title ? props.section.title : props.section.id}</h1>
        {renderSectionDescription(props.section.description)}
        {props.section.helpText && <p>{props.section.helpText}</p>}

        {props.section.fakta.map((faktum, index) => {
          if (index <= sectionFaktumIndex) {
            return <Faktum key={faktum?.textId} faktum={faktum} />;
          }
        })}
      </div>
      <nav className={styles.sectionNavigation}>
        {isBackNavigationPossible && (
          <Button variant={"secondary"} onClick={() => props.navigatePreviousSection()}>
            <Left />
            Forrige steg
          </Button>
        )}
        {showNextSectionButton && (
          <Button onClick={() => props.navigateNextSection()}>
            Neste steg <Right />
          </Button>
        )}
      </nav>
    </div>
  );
}
