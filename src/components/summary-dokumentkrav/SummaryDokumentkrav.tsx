import { BodyShort, Label } from "@navikt/ds-react";
import api from "../../api.utils";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { DokumentkravSvar } from "../dokumentkrav-svar/DokumentkravSvar";
import { DokumentkravTitle } from "../dokumentkrav-title/DokumentkravTitle";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function SummaryDokumentkrav({ dokumentkrav }: IProps) {
  const hasUploadedFiles = dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA;

  return (
    <li>
      {hasUploadedFiles && (
        <Label as="p">
          <a
            href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
            rel="noreferrer"
            target="_blank"
          >
            <DokumentkravTitle dokumentkrav={dokumentkrav} />
          </a>
        </Label>
      )}

      {!hasUploadedFiles && (
        <Label as="p">
          <DokumentkravTitle dokumentkrav={dokumentkrav} />
        </Label>
      )}

      {dokumentkrav.svar && (
        <BodyShort>
          <DokumentkravSvar dokumentkrav={dokumentkrav} />
        </BodyShort>
      )}

      {dokumentkrav.begrunnelse && <BodyShort>{dokumentkrav.begrunnelse}</BodyShort>}
    </li>
  );
}
