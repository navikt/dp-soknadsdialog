import { QuizFaktum } from "../../types/quiz.types";
import { useSanity } from "../../context/sanity-context";
import { getCountryName } from "../../utils/country.utils";
import { useRouter } from "next/router";

interface IProps {
  barn: QuizFaktum[];
}

export function BarnBostedsland({ barn }: IProps) {
  const { locale } = useRouter();
  const { getAppText } = useSanity();

  const bostedland = barn.find((svar) => svar.beskrivendeId === "faktum.barn-statsborgerskap")
    ?.svar as string;

  if (!bostedland) {
    return <>{getAppText("faktum.barn-statsborgerskap.fant-ikke-bostedsland")}</>;
  }

  // PDL kan returnerer XXX eller XUK, disse betyr statsløs eller ukjent
  if (bostedland === "XXX" || bostedland === "XUK") {
    return <>{getAppText("faktum.barn-statsborgerskap.ukjent")}</>;
  }

  return (
    <>
      {getAppText("faktum.barn-statsborgerskap.bor-i")} {getCountryName(bostedland, locale)}
    </>
  );
}
