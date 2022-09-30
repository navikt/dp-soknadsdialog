import React, { PropsWithChildren } from "react";
import styles from "./GeneratorFaktumCard.module.css";
import { Button, Detail } from "@navikt/ds-react";
import { WarningColored } from "@navikt/ds-icons";

interface IProps {
  editFaktum?: () => void;
  deleteFaktum?: () => void;
  allFaktumAnswered?: boolean;
  readOnly?: boolean;
}

export function GeneratorFaktumCard(props: PropsWithChildren<IProps>) {
  return (
    <div className={styles.card}>
      {props.children}

      <div className={styles.buttonContainer}>
        {!props.readOnly && props.editFaktum && props.allFaktumAnswered && (
          <Button size={"medium"} variant={"secondary"} onClick={props.editFaktum}>
            Endre svar
          </Button>
        )}

        {!props.allFaktumAnswered && (
          <>
            <Button size={"medium"} variant={"primary"} onClick={props.editFaktum}>
              Fyll ut
            </Button>

            <Detail uppercase>
              <WarningColored />
              Delvis utfylt
            </Detail>
          </>
        )}
      </div>
    </div>
  );
}
