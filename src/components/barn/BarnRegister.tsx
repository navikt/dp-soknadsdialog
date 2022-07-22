import React from "react";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { BodyShort } from "@navikt/ds-react";
import { getChildBirthDate, getChildName } from "./Barn";
import { FaktumProps } from "../faktum/Faktum";
import { QuizGeneratorFaktum } from "../../types/quiz.types";

export function BarnRegister(props: FaktumProps<QuizGeneratorFaktum>) {
  return (
    <>
      {props.faktum.svar?.map((fakta, index) => (
        <GeneratorFaktumCard key={index} fakta={fakta} showFaktaInline={true}>
          <BodyShort>{getChildName(fakta)}</BodyShort>
          <BodyShort size={"small"}>{getChildBirthDate(fakta)}</BodyShort>
        </GeneratorFaktumCard>
      ))}
    </>
  );
}
