import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Seksjon } from "../../../components/seksjon/Seksjon";
import { RootState } from "../../../store";
import { setSeksjoner } from "../../../store/seksjoner.slice";
import { ISoknad } from "../../api/soknad";
import { ISeksjon } from "../../../types/seksjon.types";
import { Button } from "@navikt/ds-react";

import styles from "./seksjonpage.module.css";

export default function SeksjonPage() {
  const sections: ISeksjon[] = useSelector((state: RootState) => state.seksjoner);
  const dispatch = useDispatch();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    if (!sections.length) {
      fetch("/api/soknad")
        .then((response: Response) => response.json())
        .then((data: ISoknad) => {
          dispatch(setSeksjoner(data.sections));
        });
    }
  }, [sections]);

  const renderSection = (section: ISeksjon) => <Seksjon key={section.id} {...section} />;

  const isNextSection = () => {
    return sections.length > currentSectionIndex + 1;
  };
  const isPrevSection = () => {
    return currentSectionIndex - 1 >= 0;
  };

  const nextSection = () => {
    if (isNextSection()) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };
  const prevSection = () => {
    if (isPrevSection()) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <>
      {sections.length > 0 && renderSection(sections[currentSectionIndex])}
      <div className={styles.sectionNav}>
        <Button variant="secondary" className={styles.sectionNavBack} onClick={prevSection}>
          Tilbake
        </Button>
        <Button variant="primary" className={styles.sectionNavNext} onClick={nextSection}>
          Neste
        </Button>
      </div>
    </>
  );
}
