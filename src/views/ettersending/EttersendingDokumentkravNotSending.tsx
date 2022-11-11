import React from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import {
  DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_ANDRE,
  DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE,
  ETTERSENDING_DOKUMENTER_IKKE_INNSENDING_TITTEL,
} from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../../components/HelpText";

interface IProps {
  dokumentkrav: IDokumentkrav[];
  classname?: string;
}

export function EttersendingDokumentkravNotSending({ dokumentkrav, classname }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();

  return (
    <div className={classname}>
      <Heading level="2" size="medium" className="my-3">
        {getAppText(ETTERSENDING_DOKUMENTER_IKKE_INNSENDING_TITTEL)}
      </Heading>

      {dokumentkrav.map((krav) => {
        const dokumentkravText = getDokumentkravTextById(krav.beskrivendeId);
        return (
          <div key={krav.id} className="my-3">
            <Heading level="3" size="xsmall">
              {dokumentkravText?.title ? dokumentkravText.title : krav.beskrivendeId}
            </Heading>
            <BodyShort>
              <>
                {krav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE && (
                  <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDT_TIDLIGERE)}</>
                )}
                {krav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
                  <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDER_IKKE)}</>
                )}
                {krav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
                  <>{getAppText(DOKUMENTKRAV_BEGRUNNELSE_SENDES_AV_ANDRE)}</>
                )}
              </>
            </BodyShort>
            {krav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && dokumentkravText?.helpText && (
              <HelpText helpText={dokumentkravText.helpText} />
            )}
          </div>
        );
      })}
    </div>
  );
}
