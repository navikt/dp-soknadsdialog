import React from "react";
import { Alert } from "@navikt/ds-react";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";

export function Receipt() {
  return (
    <>
      <Alert variant="success" size="medium">
        Du har sendt inn søknaden!
      </Alert>

      <NoSessionModal />
    </>
  );
}
