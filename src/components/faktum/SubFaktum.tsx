import React from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { isFaktumAnswered } from "../../faktum.utils";
import { CountryGroup, getListOfCountryCodes } from "../../country.utils";
import styles from "./Faktum.module.css";

export function SubFaktum(props: FaktumProps<IValgFaktum> & { currentAnswerIds: string[] }) {
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const generators = useSelector((state: RootState) => state.generators);

  const triggeredSubFakta = props.faktum.subFakta?.filter((faktum) =>
    faktum.requiredAnswerIds.find((id) => {
      if (id in CountryGroup) {
        return getListOfCountryCodes(id).includes(props.currentAnswerIds[0]);
      }
      return props.currentAnswerIds?.includes(id);
    })
  );

  const firstUnansweredSubFaktumIndex =
    triggeredSubFakta?.findIndex((faktum) => !isFaktumAnswered(faktum, answers, generators)) ?? -1;

  return (
    <>
      {triggeredSubFakta?.map((faktum, index) => {
        const lastFaktumIndexToShow =
          firstUnansweredSubFaktumIndex !== -1
            ? firstUnansweredSubFaktumIndex
            : triggeredSubFakta.length;

        if (index <= lastFaktumIndexToShow) {
          return (
            <div className={styles.subFaktumWrapper}>
              <Faktum
                key={faktum.textId}
                faktum={faktum}
                onChange={props.onChange}
                answers={props.answers}
              />
            </div>
          );
        }
      })}
    </>
  );
}
