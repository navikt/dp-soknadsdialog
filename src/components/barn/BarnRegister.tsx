import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import { IFaktum } from "../faktum/Faktum";
import { FormattedDate } from "../FormattedDate";
import { GeneratorFaktumCardWithFakta } from "../generator-faktum-card/GeneratorFaktumCardWithFakta";
import { BarnBostedsland } from "./BarnBodstedsland";
import { BarnNavn } from "./BarnNavn";

export function BarnRegister(props: IFaktum<IQuizGeneratorFaktum>) {
  return (
    <>
      {props.faktum.svar?.map((fakta, index) => (
        <GeneratorFaktumCardWithFakta key={index} fakta={fakta} readOnly={props.readonly}>
          <Heading level={"3"} size={"small"}>
            <BarnNavn barn={fakta} />
          </Heading>

          <BodyShort>{getChildBirthDate(fakta)}</BodyShort>

          <Detail uppercase>
            <BarnBostedsland barn={fakta} />
          </Detail>
        </GeneratorFaktumCardWithFakta>
      ))}
    </>
  );
}

export function getChildBirthDate(barnetillegg: QuizFaktum[]) {
  const date = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-foedselsdato")?.svar;

  if (!date) {
    return;
  }

  return <FormattedDate date={date as string} />;
}
