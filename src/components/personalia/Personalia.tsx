import { BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { getAge, getFormattedPersonalia } from "./personalia.utils";
import { IPersonalia } from "../../types/personalia.types";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "../section/SectionHeading";
import styles from "./Personalia.module.css";
import { useRouter } from "next/router";
import { getCountryName } from "../../country.utils";

interface IProps {
  personalia: IPersonalia;
}

export function Personalia({ personalia }: IProps) {
  const {
    fødselsDato,
    folkeregistrertAdresse: adresse,
    kontonummer,
    banknavn,
    bankLandkode,
  } = personalia;

  const router = useRouter();

  const { getSeksjonTextById, getAppText } = useSanity();
  const textId = "personalia";
  const personaliaTexts = getSeksjonTextById(textId);

  const { navn, adresselinjer, postadresse, obscuredIdent, formattedKontonummer } =
    getFormattedPersonalia(personalia);

  const isForeignBank = kontonummer && bankLandkode && bankLandkode !== "NO";

  return (
    <>
      <SectionHeading text={personaliaTexts} fallback={textId} />

      {navn && (
        <div className={styles.personaliaFaktum}>
          <Label as="p">{getAppText("personalia.navn")}</Label>
          <BodyShort>{navn}</BodyShort>
        </div>
      )}

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppText("personalia.fodselsnummer")}</Label>
        <BodyShort>{obscuredIdent}</BodyShort>
      </div>

      {fødselsDato && (
        <div className={styles.personaliaFaktum}>
          <Label as="p">{getAppText("personalia.alder")}</Label>
          <BodyShort>{getAge(fødselsDato)}</BodyShort>
        </div>
      )}

      {adresse && (
        <div className={styles.personaliaFaktum}>
          <>
            <Label as="p">{getAppText("personalia.folkeregistert-adresse")}</Label>
            {adresselinjer && <BodyShort>{adresselinjer}</BodyShort>}
            {postadresse && <BodyShort>{postadresse}</BodyShort>}
          </>
        </div>
      )}

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppText("personalia.kontonummer")}</Label>

        {kontonummer && <BodyShort>{formattedKontonummer}</BodyShort>}

        {isForeignBank && (
          <BodyShort>
            {banknavn}
            {banknavn && bankLandkode && ", "}
            {getCountryName(bankLandkode, router.locale)}
          </BodyShort>
        )}

        {!kontonummer && <BodyShort>{getAppText("personalia.kontonummer.finnes-ikke")}</BodyShort>}
      </div>
    </>
  );
}
