import React, { useEffect, useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { saveArbeidsforhold } from "../../store/arbeidsforhold.slice";
import { Faktum } from "../faktum/Faktum";
import { Answer, AnswerType } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

export function Arbeidsforhold(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const arbeidsforhold = useSelector((state: RootState) => state.arbeidsforhold);
  const [addNewArbeidsforhold, setNewArbeidsforhold] = useState(false);
  const [activeArbeidsforholdIndex, setActiveArbeidsforholdIndex] = useState<number | undefined>(0);
  const [tmpArbeidsForholdAnswers, setTmpArbeidsForholdAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (activeArbeidsforholdIndex) {
      const activeArbeidsforhold = arbeidsforhold[activeArbeidsforholdIndex];
      if (activeArbeidsforhold) {
        setTmpArbeidsForholdAnswers(activeArbeidsforhold.answers);
      }
    }
  }, [activeArbeidsforholdIndex]);

  function saveFaktum(faktumId: string, answer: AnswerType) {
    const answerIndex = tmpArbeidsForholdAnswers.findIndex(
      (answer) => answer.faktumId === faktumId
    );

    if (answerIndex === -1) {
      setTmpArbeidsForholdAnswers((state) => [...state, { faktumId, answer }]);
    } else {
      setTmpArbeidsForholdAnswers((state) => [
        ...state,
        (state[answerIndex] = { faktumId, answer }),
      ]);
    }
  }

  function onSaveArbeidsforhold() {
    dispatch(
      saveArbeidsforhold({
        arbeidsforhold: {
          answers: tmpArbeidsForholdAnswers,
        },
        index: activeArbeidsforholdIndex,
      })
    );

    resetTmpArbeidsforhold();
  }

  function onAddArbeidsforhold() {
    if (arbeidsforhold.length > 0) {
      setActiveArbeidsforholdIndex(() => arbeidsforhold.length);
    }
    setNewArbeidsforhold(!addNewArbeidsforhold);
  }

  function toggleActiveArebidsforhold(index: number) {
    if (index === activeArbeidsforholdIndex) {
      setActiveArbeidsforholdIndex(undefined);
    } else {
      setActiveArbeidsforholdIndex(index);
    }
  }

  function resetTmpArbeidsforhold() {
    setNewArbeidsforhold(false);
    setTmpArbeidsForholdAnswers([]);
    setActiveArbeidsforholdIndex(undefined);
  }

  return (
    <>
      <div>
        <Accordion>
          {arbeidsforhold.map((forhold, index) => (
            <Accordion.Item key={index} open={index === activeArbeidsforholdIndex}>
              <Accordion.Header onClick={() => toggleActiveArebidsforhold(index)}>
                {forhold.answers.find((answer) => answer.faktumId === "faktum.navn-bedrift")
                  ?.answer ?? "Mangler navn"}
              </Accordion.Header>
              <Accordion.Content>
                <>
                  {props.faktum.map((faktum) => (
                    <div key={faktum.id}>
                      <Faktum faktum={faktum} onChange={saveFaktum} />
                    </div>
                  ))}

                  <Button onClick={onSaveArbeidsforhold}>Lagre arbreidsforhold</Button>
                </>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {!addNewArbeidsforhold && (
        <Button onClick={onAddArbeidsforhold}>Legg til arbreidsforhold</Button>
      )}

      {addNewArbeidsforhold && (
        <>
          {props.faktum.map((faktum) => (
            <div key={faktum.id}>
              <Faktum faktum={faktum} onChange={saveFaktum} />
            </div>
          ))}
          <Button onClick={onSaveArbeidsforhold}>Lagre arbreidsforhold</Button>
          <Button onClick={resetTmpArbeidsforhold}>Avbryt</Button>
        </>
      )}
    </>
  );
}
