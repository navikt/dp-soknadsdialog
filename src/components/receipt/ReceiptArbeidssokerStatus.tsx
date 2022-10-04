import React from "react";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { Alert } from "@navikt/ds-react";

export function ArbeidssokerStatus(props: IArbeidssokerStatus) {
  return props.isRegistered ? (
    <div>
      Du må huske å sende meldekort innen fristen, også mens du venter på svar på søknaden din.
    </div>
  ) : (
    <Alert variant={"warning"}>
      Du er ikke registrert som arbeidssøker. Etter du er registrert må du sende hvert meldekort
      innen fristen, også når du venter på svar på søknaden din, ellers blir du avregistrert. Hvis
      du ikke sender meldekort kan du miste retten til dagpenger.
    </Alert>
  );
}
