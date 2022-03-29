import React, { useEffect, useState } from "react";
import styles from "./Section.module.css";
import { ISection } from "../../types/section.types";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@navikt/ds-react";
import { usePrevious } from "../../hooks/usePrevious";
import { isGeneratorFaktum } from "../../sanity/type-guards";
import { setSectionFaktumIndex } from "../../store/navigation.slice";
import { Faktum } from "../faktum/Faktum";
import { isArrayEqual, isFaktumAnswered, isGeneratorFaktumAnswered } from "../../faktum.utils";

interface Props {
  section: ISection;
  navigateNextSection: () => void;
  navigatePreviousSection: () => void;
}

export function Section(props: Props) {
  const dispatch = useDispatch();
  const [showNextSectionBtn, setShowNextSectionBtn] = useState(false);

  const answers = useSelector((state: RootState) => state.answers);
  const prevAnswers = usePrevious(answers) ?? answers;

  const generators = useSelector((state: RootState) => state.generators);
  const prevGenerators = usePrevious(generators) ?? generators;

  const navigationState = useSelector((state: RootState) => state.navigation);

  useEffect(() => {
    checkAllFaktaAnswered();
  }, [navigationState.currentSectionIndex]);

  useEffect(() => {
    if (!isArrayEqual(answers, prevAnswers) || !isArrayEqual(generators, prevGenerators)) {
      checkAllFaktaAnswered();
    }
  }, [answers, generators]);

  function checkAllFaktaAnswered() {
    const allFaktaAnswered = props.section.faktum.every((faktum, index) => {
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
          if (index <= navigationState.sectionFaktumIndex) {
            return <Faktum key={faktum?.textId} faktum={faktum} />;
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
