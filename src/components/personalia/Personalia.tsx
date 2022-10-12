import { BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { FormattedDate } from "../FormattedDate";
import { getAge, getFormattedPersonalia } from "../../personalia.utils";
import { IPersonalia } from "../../types/personalia.types";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "../section/SectionHeading";
import styles from "./Personalia.module.css";

interface IProps {
  personalia: IPersonalia;
}

export function Personalia({ personalia }: IProps) {
  const { fødselsDato, folkeregistrertAdresse: adresse, kontonummer } = personalia;

  const { getSeksjonTextById, getAppTekst } = useSanity();
  const textId = "personalia";
  const personaliaTexts = getSeksjonTextById(textId);

  const { navn, adresselinjer, postadresse } = getFormattedPersonalia(personalia);

  return (
    <>
      <SectionHeading text={personaliaTexts} fallback={textId} />

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppTekst("personalia.faktum.navn")}</Label>
        <BodyShort>{navn}</BodyShort>
      </div>

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppTekst("personalia.faktum.fodselsdato")}</Label>
        <BodyShort>
          <FormattedDate date={fødselsDato} />
        </BodyShort>
      </div>

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppTekst("personalia.faktum.alder")}</Label>
        <BodyShort>{getAge(fødselsDato)}</BodyShort>
      </div>

      <div className={styles.personaliaFaktum}>
        {adresse && (
          <>
            <Label as="p">{getAppTekst("personalia.faktum.folkeregistert-adresse")}</Label>
            {adresselinjer && <BodyShort>{adresselinjer}</BodyShort>}
            {postadresse && <BodyShort>{postadresse}</BodyShort>}
          </>
        )}
      </div>

      <div className={styles.personaliaFaktum}>
        {kontonummer && (
          <>
            <Label as="p">{getAppTekst("personalia.faktum.kontonummer")}</Label>
            <BodyShort>{kontonummer}</BodyShort>
          </>
        )}
      </div>
    </>
  );
}
