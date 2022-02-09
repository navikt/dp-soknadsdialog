import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Button } from "@navikt/ds-react";
import { IArbeidsforhold, saveArbeidsforhold } from "../../store/arbeidsforhold.slice";
import { Faktum } from "../faktum/Faktum";
import { AnswerType } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

export function Arbeidsforhold(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const arbeidsforhold = useSelector((state: RootState) => state.arbeidsforhold);
  const [addNewArbeidsforhold, setNewArbeidsforhold] = useState(false);
  const [tmpArbeidsForhold, setTmpArbeidsForhold] = useState<IArbeidsforhold>({
    id: props.id,
    name: "",
    fromDate: "",
    fakta: [],
  });

  function saveFaktum(faktumId: string, answer: AnswerType) {
    // console.log("faktumId: ", faktumId);
    // console.log("value: ", answer);
    if (faktumId === "faktum.navn-bedrift") {
      const name = answer as string;
      setTmpArbeidsForhold((state) => ({ ...state, name }));
    }

    if (faktumId === "faktum.arbeidsforhold-varighet") {
      // console.log("Trekk ut datoen og noe greier her");
    }

    const faktumIndex = tmpArbeidsForhold.fakta.findIndex(
      (forhold) => forhold.faktumId === faktumId
    );

    if (faktumIndex === -1) {
      setTmpArbeidsForhold((state) => ({
        ...state,
        fakta: [...tmpArbeidsForhold.fakta, { faktumId, answer }],
      }));
    } else {
      const fakta = [...tmpArbeidsForhold.fakta];
      fakta[faktumIndex] = { faktumId, answer };

      setTmpArbeidsForhold((state) => ({
        ...state,
        fakta,
      }));
    }
  }

  function onSaveArbeidsforhold() {
    dispatch(saveArbeidsforhold(tmpArbeidsForhold));
    setNewArbeidsforhold(false);
    setTmpArbeidsForhold({
      id: props.id,
      name: "",
      fromDate: "",
      fakta: [],
    });

    // Set focus top of arbeidsforhold section
  }

  return (
    <>
      <div>
        {arbeidsforhold.map((forhold) => (
          <>
            <div> {forhold.name}</div>
            <div> {forhold.fromDate}</div>
            <div> {forhold.toDate}</div>
          </>
        ))}
      </div>

      <Button onClick={() => setNewArbeidsforhold(!addNewArbeidsforhold)}>
        Legg til arbreidsforhold
      </Button>

      {addNewArbeidsforhold && (
        <>
          {props.faktum.map((faktum) => (
            <div key={faktum.id}>
              <Faktum faktum={faktum} onChange={saveFaktum} />
            </div>
          ))}
          <Button onClick={onSaveArbeidsforhold}>Lagre arbreidsforhold</Button>
        </>
      )}
    </>
  );
}
