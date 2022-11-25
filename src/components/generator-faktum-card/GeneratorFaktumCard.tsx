import React, { PropsWithChildren, useState } from "react";
import styles from "./GeneratorFaktumCard.module.css";
import { Button, Detail } from "@navikt/ds-react";
import { WarningColored } from "@navikt/ds-icons";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { useSanity } from "../../context/sanity-context";
import { DeleteGeneratorFaktumModal } from "../delete-generator-faktum-modal/deleteGeneratorFaktumModal";

export type generatorFaktumType = "standard" | "barn" | "arbeidsforhold";

interface IProps {
  generatorFaktumType: generatorFaktumType;
  editFaktum?: () => void;
  deleteFaktum?: () => void;
  allFaktumAnswered?: boolean;
  readOnly?: boolean;
  showValidationMessage: boolean;
}

export function GeneratorFaktumCard(props: PropsWithChildren<IProps>): JSX.Element {
  const {
    children,
    readOnly,
    editFaktum,
    allFaktumAnswered,
    showValidationMessage,
    generatorFaktumType,
    deleteFaktum,
  } = props;
  const { getAppText } = useSanity();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.card}>
      {children}

      {!readOnly && editFaktum && allFaktumAnswered && (
        <div className={styles.buttonContainer}>
          <Button size={"medium"} variant={"secondary"} onClick={editFaktum}>
            Endre svar
          </Button>
          <Button size={"medium"} variant={"secondary"} onClick={() => setModalOpen(true)}>
            Slett
          </Button>
        </div>
      )}

      {!allFaktumAnswered && (
        <>
          <div className={styles.buttonContainer}>
            <Detail uppercase>
              <WarningColored />
              Delvis utfylt
            </Detail>
          </div>
          <div className={styles.buttonContainer}>
            <Button size={"medium"} variant={"primary"} onClick={editFaktum}>
              Fyll ut
            </Button>

            <Button size={"medium"} variant={"secondary"} onClick={() => setModalOpen(true)}>
              Slett
            </Button>
          </div>
        </>
      )}

      {showValidationMessage && (
        <ValidationMessage message={getAppText("validering.generator-faktum.delvis-besvart")} />
      )}

      <DeleteGeneratorFaktumModal
        faktumType={generatorFaktumType}
        delete={deleteFaktum}
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </div>
  );
}
