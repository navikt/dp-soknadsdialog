import { useSanity } from "../../context/sanity-context";
import { QuizFaktum } from "../../types/quiz.types";

interface IProps {
  barn: QuizFaktum[];
}

export function BarnNavn({ barn }: IProps) {
  const { getAppText } = useSanity();

  const firstName = barn.find((svar) => svar.beskrivendeId === "faktum.barn-fornavn-mellomnavn")
    ?.svar as string;

  const lastName = barn.find((svar) => svar.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  if (!firstName) {
    return <>{getAppText("faktum.barn-fornavn-mellomnavn.mangler-navn")}</>;
  }

  if (firstName && !lastName) {
    return (
      <>
        {firstName} {getAppText("faktum.barn-fornavn-mellomnavn.mangler-etternavn")}
      </>
    );
  }

  return (
    <>
      {firstName} {lastName}
    </>
  );
}
