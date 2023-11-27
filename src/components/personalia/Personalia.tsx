import { Alert, BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { getAge, getFormattedPersonalia } from "./personalia.utils";
import { IPersonalia } from "../../types/personalia.types";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "../section/SectionHeading";
import styles from "./Personalia.module.css";
import { useRouter } from "next/router";
import { getCountryName } from "../../utils/country.utils";
import Link from "next/link";

interface IProps {
  personalia: IPersonalia;
  mode?: "standard" | "summary";
}

export function Personalia({ personalia, mode = "standard" }: IProps) {
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

  const { navn, adresselinjer, postadresse, formattedKontonummer, fnr } =
    getFormattedPersonalia(personalia);

  const isForeignBank = kontonummer && bankLandkode && bankLandkode !== "NO";

  const alder = getAge(fødselsDato);

  return (
    <>
      {mode === "standard" && <SectionHeading text={personaliaTexts} fallback={textId} />}

      {navn && (
        <div className={styles.personaliaFaktum}>
          <Label as="p">{getAppText("personalia.navn")}</Label>
          <BodyShort>{navn}</BodyShort>
        </div>
      )}

      <div className={styles.personaliaFaktum}>
        <Label as="p">{getAppText("personalia.fodselsnummer")}</Label>
        <BodyShort>{fnr}</BodyShort>
      </div>

      {fødselsDato && (
        <div className={styles.personaliaFaktum}>
          <Label as="p">{getAppText("personalia.alder")}</Label>
          <BodyShort>{alder}</BodyShort>
        </div>
      )}

      {alder && alder >= 67 && (
        <Alert variant="warning" className={styles.over67Warning}>
          <Label as="p">{getAppText("personalia.over-67.tittel")}</Label>
          <p>
            {getAppText("personalia.over-67.beskrivelse")}{" "}
            <Link href="https://www.nav.no/soknader/nb/person/pensjon">
              {getAppText("personalia.over-67.lenketekst")}
            </Link>
            .
          </p>
        </Alert>
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
