import { Fragment, useEffect, useState } from "react";
import { useQuiz } from "../../../context/quiz-context";
import { useUserInformation } from "../../../context/user-information-context";
import { QuizFaktum } from "../../../types/quiz.types";
import { Faktum } from "../../faktum/Faktum";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper_V2(props: IProps) {
  const { fakta, readonly } = props;
  const { saveFaktumToQuiz, soknadState } = useQuiz();
  const { contextSelectedArbeidsforhold } = useUserInformation();
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const arbeidsforholdBedriftsnavn = fakta.find(
    (faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold.navn-bedrift",
  );

  useEffect(() => {
    if (forceUpdate) setForceUpdate(false);
  }, [soknadState]);

  useEffect(() => {
    if (
      arbeidsforholdBedriftsnavn &&
      !arbeidsforholdBedriftsnavn?.svar &&
      contextSelectedArbeidsforhold
    ) {
      saveFaktumToQuiz(
        arbeidsforholdBedriftsnavn,
        contextSelectedArbeidsforhold?.organisasjonsnavn,
      );
      setForceUpdate(true);
    }
  }, [fakta]);

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            <Faktum faktum={faktum} readonly={readonly} forceUpdate={forceUpdate} />
          </Fragment>
        );
      })}
    </>
  );
}
