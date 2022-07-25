import React from "react";
import { GeneratorFaktumCard } from "../generator-faktum-card/GeneratorFaktumCard";
import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import { getChildBirthDate, getChildBostedsland, getChildName } from "./Barn";
import { FaktumProps } from "../faktum/Faktum";
import { QuizGeneratorFaktum } from "../../types/quiz.types";
import { useRouter } from "next/router";

export function BarnRegister(props: FaktumProps<QuizGeneratorFaktum>) {
  const { locale } = useRouter();
  return (
    <>
      {props.faktum.svar?.map((fakta, index) => (
        <GeneratorFaktumCard key={index} fakta={fakta} showFaktaInline={true}>
          <Heading level={"3"} size={"small"}>
            {getChildName(fakta)}
          </Heading>
          <BodyShort>{getChildBirthDate(fakta)}</BodyShort>
          <Detail uppercase>
            <>{getChildBostedsland(fakta, locale)}</>
          </Detail>
        </GeneratorFaktumCard>
      ))}
    </>
  );
}
