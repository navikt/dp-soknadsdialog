import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Seksjon } from "../components/seksjon/Seksjon";
import { setCurrentSectionId } from "../store/navigation.slice";

export function Soknad() {
  const sections = useSelector((state: RootState) => state.sections);
  const navigationState = useSelector((state: RootState) => state.navigation);
  const dispatch = useDispatch();
  const currentSection = sections.find(
    (section) => section.id === navigationState.currentSectionId
  );

  useEffect(() => {
    dispatch(setCurrentSectionId(sections[0].id));
  }, []);

  return <div>{currentSection && <Seksjon {...currentSection} />}</div>;
}
