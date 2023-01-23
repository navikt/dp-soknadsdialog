import { BodyShort, Label } from "@navikt/ds-react";
import api from "../../api.utils";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { useSanity } from "../../context/sanity-context";
import { getDokumentkravSvarText } from "../../dokumentkrav.util";
import { IDokumentkrav } from "../../types/documentation.types";
import { DokumentkravTitle } from "../dokumentkrav/DokumentkravTitle";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function SummaryDokumentkrav({ dokumentkrav }: IProps) {
  const { getAppText } = useSanity();
  const answerText = getDokumentkravSvarText(dokumentkrav);
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

      {answerText && <BodyShort>{getAppText(answerText)}</BodyShort>}

      {dokumentkrav.begrunnelse && <BodyShort>{dokumentkrav.begrunnelse}</BodyShort>}
    </li>
  );
}
