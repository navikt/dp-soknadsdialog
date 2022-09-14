import React from "react";
import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import { IFaktum } from "../faktum/Faktum";
import { QuizFaktum, IQuizGeneratorFaktum } from "../../types/quiz.types";
import { useRouter } from "next/router";
import { getCountryName } from "../../country.utils";
import { GeneratorFaktumCardWithFakta } from "../generator-faktum-card/GeneratorFaktumCardWithFakta";
import { FormattedDate } from "../FormattedDate";

export function BarnRegister(props: IFaktum<IQuizGeneratorFaktum>) {
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
  const date = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-foedselsdato")?.svar;

  if (!date) {
    return;
  }

  return <FormattedDate date={date as string} />;
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
