import React, { useState } from "react";
import { Button } from "@navikt/ds-react";
import { DeleteProsessModal } from "./DeleteProsessModal";
import { ContinueLaterModal } from "./ContinueLaterModal";
import { useSanity } from "../../context/sanity-context";

export function ExitSoknad() {
  const { getAppText } = useSanity();
  const [deleteSoknadModalOpen, setDeleteSoknadModalOpen] = useState(false);
  const [continueLaterModalOpen, setContinueLaterModalOpen] = useState(false);
  return (
    <div>
      <Button variant="tertiary" onClick={() => setContinueLaterModalOpen(!continueLaterModalOpen)}>
        {getAppText("soknad.knapp.fortsett-senere")}
      </Button>
      <Button variant="tertiary" onClick={() => setDeleteSoknadModalOpen(!deleteSoknadModalOpen)}>
        {getAppText("soknad.knapp.slett")}
      </Button>

      <DeleteProsessModal
        prosessType={"Dagpenger"}
        isOpen={deleteSoknadModalOpen}
        handleClose={() => setDeleteSoknadModalOpen(false)}
      />

      <ContinueLaterModal
        isOpen={continueLaterModalOpen}
        handleClose={() => setContinueLaterModalOpen(false)}
      />
    </div>
  );
}
