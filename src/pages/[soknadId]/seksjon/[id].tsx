import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Seksjon } from "../../../components/seksjon/Seksjon";
import { RootState } from "../../../store";
import { setSeksjoner } from "../../../store/seksjoner.slice";
import { ISoknad } from "../../api/soknad";
export default function SeksjonPage() {
  const sections = useSelector((state: RootState) => state.seksjoner);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sections.length) {
      fetch("/api/soknad")
        .then((response: Response) => response.json())
        .then((data: ISoknad) => {
          dispatch(setSeksjoner(data.sections));
        });
    }
  }, [sections]);
  return sections.map((section) => <Seksjon key={section.id} {...section} />);
}
