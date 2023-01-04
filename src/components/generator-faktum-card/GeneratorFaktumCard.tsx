import React, { PropsWithChildren, useState } from "react";
import { Button, Detail } from "@navikt/ds-react";
import { WarningColored } from "@navikt/ds-icons";
import { ValidationMessage } from "../faktum/validation/ValidationMessage";
import { useSanity } from "../../context/sanity-context";
import { DeleteGeneratorFaktumModal } from "../delete-generator-faktum-modal/DeleteGeneratorFaktumModal";
import styles from "./GeneratorFaktumCard.module.css";

export type generatorFaktumType = "standard" | "barn" | "arbeidsforhold";

interface IProps {
  generatorFaktumType: generatorFaktumType;
  editFaktum?: () => void;
  deleteFaktum?: () => void;
  allFaktumAnswered?: boolean;
  showValidationMessage: boolean;
}

export function GeneratorFaktumCard(props: PropsWithChildren<IProps>): JSX.Element {
  const {
    children,
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

      {allFaktumAnswered && editFaktum && (
        <div className={styles.buttonContainer}>
          <Button size={"medium"} variant={"secondary"} onClick={editFaktum}>
            {getAppText("generator-faktum-kort.endre-svar.knapp")}
          </Button>

          <Button size={"medium"} variant={"secondary"} onClick={() => setModalOpen(true)}>
            {getAppText("generator-faktum-kort.slett.knapp")}
          </Button>
        </div>
      )}

      {!allFaktumAnswered && (
        <>
          <div className={styles.buttonContainer}>
            <Detail uppercase>
              <WarningColored />
              {getAppText("generator-faktum-kort.delvis-utfylt.varsel")}
            </Detail>
          </div>

          <div className={styles.buttonContainer}>
            <Button size={"medium"} variant={"primary"} onClick={editFaktum}>
              {getAppText("generator-faktum-kort.fyll-ut.knapp")}
            </Button>

            <Button size={"medium"} variant={"secondary"} onClick={() => setModalOpen(true)}>
              {getAppText("generator-faktum-kort.slett.knapp")}
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
