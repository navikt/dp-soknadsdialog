import React from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
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
        {getAppText("ettersending.dokumenter.ikke-innsending.tittel")}
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
                  <>{getAppText("dokumentkrav.begrunnelse.sendt-tidligere")}</>
                )}
                {krav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE && (
                  <>{getAppText("dokumentkrav.begrunnelse.sender-ikke")}</>
                )}
                {krav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
                  <>{getAppText("dokumentkrav.begrunnelse.sendes-av-andre")}</>
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
