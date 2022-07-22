import React from "react";
import styles from "./BarnCard.module.css";
import { QuizFaktum } from "../../types/quiz.types";
import { BodyShort, Button } from "@navikt/ds-react";
import { Faktum } from "../faktum/Faktum";

interface Props {
  barnFaktum: QuizFaktum[];
  editChild?: () => void;
  deleteChild?: () => void;
  showFaktumInline?: boolean;
}

export function BarnCard(props: Props) {
  return (
    <div className={styles.barn}>
      <BodyShort>{getChildName(props.barnFaktum)}</BodyShort>
      <BodyShort size={"small"}>{getChildBirthDate(props.barnFaktum)}</BodyShort>

      {props.showFaktumInline && (
        <div className={styles.barnFakta}>
          {props.barnFaktum.map(
            (faktum) =>
              !faktum.readOnly && (
                <Faktum key={faktum.id} faktum={faktum} readonly={faktum.readOnly} />
              )
          )}
        </div>
      )}

      {props.editChild && props.deleteChild && (
        <div>
          <Button onClick={props.editChild}>Rediger barn</Button>
          <Button variant={"danger"} onClick={props.deleteChild}>
            Slett barn
          </Button>
        </div>
      )}
    </div>
  );
}

function getChildBirthDate(barnetillegg: QuizFaktum[]) {
  return barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-foedselsdato")
    ?.svar as string;
}

function getChildName(barnetillegg: QuizFaktum[]): string {
  const firstName = barnetillegg.find(
    (svar) => svar.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.svar as string;

  const lastName = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  return `${firstName} ${lastName}`;
}
