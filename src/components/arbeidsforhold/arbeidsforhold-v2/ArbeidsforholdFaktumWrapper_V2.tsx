import { Fragment } from "react";
import { QuizFaktum } from "../../../types/quiz.types";
import { Faktum } from "../../faktum/Faktum";

interface IProps {
  fakta: QuizFaktum[];
  readonly?: boolean;
}

export function ArbeidsforholdFaktumWrapper_V2(props: IProps) {
  const { fakta, readonly } = props;

  return (
    <>
      {fakta.map((faktum) => {
        return (
          <Fragment key={faktum.id}>
            <Faktum faktum={faktum} readonly={readonly} />
          </Fragment>
        );
      })}
    </>
  );
}
