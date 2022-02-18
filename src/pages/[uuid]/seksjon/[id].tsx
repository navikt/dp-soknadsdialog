import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Seksjon } from "../../../components/seksjon/Seksjon";
import { RootState } from "../../../store";
import { setSections } from "../../../store/sections.slice";
import { ISoknad } from "../../api/soknad";
import { ISection } from "../../../types/section.types";
import { Button } from "@navikt/ds-react";

import styles from "./seksjonpage.module.css";
import api from "../../../api.utils";
import { useRouter } from "next/router";

export default function SeksjonPage() {
  const sections: ISection[] = useSelector((state: RootState) => state.sections);
  const dispatch = useDispatch();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const router = useRouter();
  const soknadUUID = router.query.soknadId as string;

  useEffect(() => {
    if (!sections.length) {
      fetch(api(`soknad/${soknadUUID}/fakta`))
        .then((response: Response) => response.json())
        .then((data: ISoknad) => {
          dispatch(setSections(data.sections));
        });
    }
  }, [sections]);

  const renderSection = (section: ISection) => <Seksjon key={section.id} {...section} />;

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
