import React from "react";
import { ISoknadStatus } from "../../pages/api/soknad/[uuid]/status";

export function ReceiptSoknadTilstand(props: ISoknadStatus) {
  return <div>Status på søknad: {props.tilstand}</div>;
}
