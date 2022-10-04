import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Button, Heading, ReadMore, Tag } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
} from "../../constants";
import { PortableText } from "@portabletext/react";
import styles from "./ReceiptDocumentsMissing.module.css";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsMissing(props: IProps) {
  const { getAppTekst, getDokumentkravTextById } = useSanity();
  return (
    <div>
      <div className={styles.headingContainer}>
        <Heading level={"2"} size="medium">
          {getAppTekst("kvittering.heading.mangler.dokumenter")}
        </Heading>
        <Tag variant="warning">
          {props.documents?.length} {getAppTekst("kvittering.text.antall-mangler")}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => {
        const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);
        return (
          <div key={dokumentkrav.beskrivendeId} className={styles.dokumentkrav}>
            <Heading level="3" size="small">
              {dokumentkravText?.text ? dokumentkravText.text : dokumentkrav.beskrivendeId}
            </Heading>
            <BodyShort>
              <>
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
                  <>{getAppTekst("kvittering.text.skal-sendes-av.noen-andre")}</>
                )}
                {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
                  <>{getAppTekst("kvittering.text.skal-sendes-av.deg")}</>
                )}
              </>
            </BodyShort>

            {dokumentkravText?.helpText && (
              <ReadMore header={dokumentkravText?.helpText?.title}>
                {dokumentkravText?.helpText?.body && (
                  <PortableText value={dokumentkravText.helpText.body} />
                )}
              </ReadMore>
            )}

            <Button> Last opp</Button>
          </div>
        );
      })}
    </div>
  );
}
