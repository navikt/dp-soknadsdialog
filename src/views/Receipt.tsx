import React from "react";
import { Alert } from "@navikt/ds-react";

export function Receipt() {
  return (
    <Alert variant="success" size="medium">
      Du har sendt inn søknaden!
    </Alert>
  );
}
