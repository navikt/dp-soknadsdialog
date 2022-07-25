import React, { PropsWithChildren } from "react";
import styles from "./GeneratorFaktumCard.module.css";
import { QuizFaktum } from "../../types/quiz.types";
import { Button } from "@navikt/ds-react";
import { Faktum } from "../faktum/Faktum";
import { Delete, Edit } from "@navikt/ds-icons";

interface Props {
  fakta: QuizFaktum[];
  editFaktum?: () => void;
  deleteFaktum?: () => void;
  showFaktaInline?: boolean;
}

export function GeneratorFaktumCard(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.container}>
      {props.children}

      {props.showFaktaInline && (
        <div className={styles.fakta}>
          {props.fakta.map(
            (faktum) =>
              !faktum.readOnly && (
                <Faktum key={faktum.id} faktum={faktum} readonly={faktum.readOnly} />
              )
          )}
        </div>
      )}

      {props.editFaktum && props.deleteFaktum && (
        <div>
          <Button size={"small"} onClick={props.editFaktum}>
            Endre
            <Edit />
          </Button>
          <Button size={"small"} variant={"danger"} onClick={props.deleteFaktum}>
            Slett
            <Delete />
          </Button>
        </div>
      )}
    </div>
  );
}
