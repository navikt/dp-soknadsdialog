import React from "react";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import { Label, BodyShort } from "@navikt/ds-react";
import { booleanToTextId } from "../faktum/FaktumBoolean";
import { useRouter } from "next/router";
import { getCountryName } from "../../country.utils";

interface SummaryFaktumProps {
  faktum: QuizFaktum | QuizGeneratorFaktum;
}

export function SummaryFaktum(props: SummaryFaktumProps) {
  const router = useRouter();
  //TODO: Spesialtilfeller - eget gårdsbruk
  function answerPerFaktum(faktum: QuizFaktum | QuizGeneratorFaktum) {
    switch (faktum.type) {
      case "boolean":
        return <BodyShort>{booleanToTextId(faktum)}</BodyShort>;

      case "envalg":
      case "tekst":
      case "double":
      case "int":
        return <BodyShort>{faktum.svar}</BodyShort>;

      case "flervalg":
        return (
          <ul>
            {faktum.svar?.map((svar, index) => (
              <li key={index}>
                <BodyShort>{svar}</BodyShort>
              </li>
            ))}
          </ul>
        );
      case "land":
        return faktum.svar && <BodyShort>{getCountryName(faktum.svar, router.locale)}</BodyShort>;

      case "localdate":
        return faktum.svar && <BodyShort>{formatDate(faktum.svar)}</BodyShort>;

      case "periode":
        return (
          <ul>
            <li>
              <BodyShort>Fra og med {faktum.svar?.fom && formatDate(faktum.svar.fom)}</BodyShort>
            </li>
            <li>
              <BodyShort>Til og med {faktum.svar?.tom && formatDate(faktum.svar.tom)}</BodyShort>
            </li>
          </ul>
        );
      case "generator":
        return "TODO";
    }
  }

  function formatDate(string: string) {
    const [year, month, date] = string.split("-");
    const monthIndex = parseInt(month) - 1; // Månedsindex, januar blir 0'te måned i stedet for 1

    return new Date(parseInt(year), monthIndex, parseInt(date)).toLocaleString("no-NB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <>
      <Label>{props.faktum.beskrivendeId}</Label>
      {answerPerFaktum(props.faktum)}
    </>
  );
}
