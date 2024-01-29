import { Select } from "@navikt/ds-react";
import { useQuiz } from "../../context/quiz-context";
import { useUserInformation } from "../../context/user-information-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import { PropsWithChildren, useEffect, useState } from "react";
import { IAareg } from "./Aareg";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

function FyllUt(props: PropsWithChildren<IProps>) {
  const { fakta } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { arbeidsforhold } = useUserInformation();
  const [currentArbeidsforhold, setCurrentArbeidsforhold] = useState<IAareg | undefined>(undefined);

  function selectArbeidsforhold(faktum: QuizFaktum, event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedArbeidsforhold = arbeidsforhold.find(
      (forhold) => forhold.id === event.target.value,
    );

    if (!selectedArbeidsforhold) return;

    setCurrentArbeidsforhold(selectedArbeidsforhold);
    saveFaktumToQuiz(faktum, selectedArbeidsforhold.organisasjonsnavn);
  }

  useEffect(() => {
    const varighet = fakta.find(
      (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.varighet" && !faktum.svar,
    );
    if (currentArbeidsforhold && varighet) {
      const periode: IQuizPeriodeFaktumAnswerType = { fom: currentArbeidsforhold.startdato };
      if (currentArbeidsforhold.sluttdato) periode.tom = currentArbeidsforhold.sluttdato;
      saveFaktumToQuiz(varighet, periode);
    }
  }, [fakta]);

  return (
    <>
      {fakta.map((faktum) => {
        if (
          faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift" &&
          arbeidsforhold?.length
        ) {
          return (
            <>
              <Select
                label="Velg arbeidsgiver"
                onChange={(event) => selectArbeidsforhold(faktum, event)}
              >
                <option key="undefined" value={undefined}></option>
                {arbeidsforhold.map((forhold) => (
                  <option value={forhold.id} key={forhold.id}>
                    {forhold.organisasjonsnavn}
                  </option>
                ))}
              </Select>

              <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
            </>
          );
        }

        if (currentArbeidsforhold && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
          return (
            <>
              {/* TODO: Oppdater periode */}
              <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />
            </>
          );
        }

        return <Faktum key={faktum.id} faktum={faktum} readonly={props.readonly} />;
      })}
    </>
  );
}

export { FyllUt };
