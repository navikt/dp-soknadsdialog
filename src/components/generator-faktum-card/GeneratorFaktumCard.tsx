import React, { PropsWithChildren } from "react";
import styles from "./GeneratorFaktumCard.module.css";
import { Button, Detail } from "@navikt/ds-react";
import { WarningColored } from "@navikt/ds-icons";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  editFaktum?: () => void;
  deleteFaktum?: () => void;
  allFaktumAnswered?: boolean;
  readOnly?: boolean;
  showValidationMessage: boolean;
}

export function GeneratorFaktumCard(props: PropsWithChildren<IProps>) {
  const { getAppText } = useSanity();

  return (
    <div className={styles.card}>
      {props.children}

      {!props.readOnly && props.editFaktum && props.allFaktumAnswered && (
        <div className={styles.buttonContainer}>
          <Button size={"medium"} variant={"secondary"} onClick={props.editFaktum}>
            Endre svar
          </Button>
          <Button size={"medium"} variant={"secondary"} onClick={props.deleteFaktum}>
            Slett arbeidsforhold
          </Button>
        </div>
      )}

      {!props.allFaktumAnswered && (
        <>
          <div className={styles.buttonContainer}>
            <Detail uppercase>
              <WarningColored />
              Delvis utfylt
            </Detail>
          </div>
          <div className={styles.buttonContainer}>
            <Button size={"medium"} variant={"primary"} onClick={props.editFaktum}>
              Fyll ut
            </Button>

            <Button size={"medium"} variant={"secondary"} onClick={props.deleteFaktum}>
              Slett arbeidsforhold
            </Button>
          </div>
        </>
      )}

      {props.showValidationMessage && (
        <ValidationMessage message={getAppText("validering.generator-faktum.delvis-besvart")} />
      )}
    </div>
  );
}
