import React from "react";
import { useSelector } from "react-redux";
import { Seksjon } from "../../../components/seksjon/Seksjon";
import { RootState } from "../../../store";
export default function SeksjonPage() {
  const sections = useSelector((state: RootState) => state.seksjoner);
  return sections.map((section) => <Seksjon key={section.id} {...section} />);
}
