import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ISection } from "../types/section.types";
import { Seksjon } from "../components/seksjon/Seksjon";

export function Soknad() {
  const sections = useSelector((state: RootState) => state.sections);
  return (
    <div>
      {sections.map((section: ISection) => (
        <Seksjon key={section.id} {...section} />
      ))}
    </div>
  );
}
