import React from "react";
import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import { FaktumProps } from "../faktum/Faktum";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import { useRouter } from "next/router";
import { getCountryName } from "../../country.utils";
import { GeneratorFaktumCardWithFakta } from "../generator-faktum-card/GeneratorFaktumCardWithFakta";

export function BarnRegister(props: FaktumProps<QuizGeneratorFaktum>) {
  const { locale } = useRouter();
  return (
    <>
      {props.faktum.svar?.map((fakta, index) => (
        <GeneratorFaktumCardWithFakta key={index} fakta={fakta}>
          <Heading level={"3"} size={"small"}>
            {getChildName(fakta)}
          </Heading>

          <BodyShort>{getChildBirthDate(fakta)}</BodyShort>

          <Detail uppercase>
            <>{getChildBostedsland(fakta, locale)}</>
          </Detail>
        </GeneratorFaktumCardWithFakta>
      ))}
    </>
  );
}

export function getChildBirthDate(barnetillegg: QuizFaktum[]) {
  return barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-foedselsdato")
    ?.svar as string;
}

export function getChildName(barnetillegg: QuizFaktum[]): string {
  const firstName = barnetillegg.find(
    (svar) => svar.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.svar as string;

  const lastName = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  return `${firstName} ${lastName}`;
}

export function getChildBostedsland(barn: QuizFaktum[], locale = "nb"): string {
  const bostedland = barn.find((svar) => svar.beskrivendeId === "faktum.barn-statsborgerskap")
    ?.svar as string;
  if (!bostedland) return "Fant ikke bostedsland";
  return `Bor i ${getCountryName(bostedland, locale)}`;
}
