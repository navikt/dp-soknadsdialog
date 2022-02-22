import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ISection } from "../../types/section.types";
import { Seksjon } from "../seksjon/Seksjon";

export function Soknad() {
  const sections = useSelector((state: RootState) => state.sections);
  const { query } = useRouter();
  const uuid = query.uuid as string;
  fetch(`${process.env.SELF_URL}/api/soknad/${uuid}/fakta`).then((data) => {
    data.json().then((fakta) => {
      // eslint-disable-next-line no-console
      console.log(fakta);
    });
  });
  return (
    <div>
      {sections.map((section: ISection) => (
        <Seksjon key={section.id} {...section} />
      ))}
    </div>
  );
}
