import React from "react";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { useSanity } from "../../context/sanity-context";
import { useQuiz } from "../../context/quiz-context";
import { Personalia } from "../../components/personalia/Personalia";
import { IPersonalia } from "../../types/personalia.types";
import { IDokumentkravList } from "../../types/documentation.types";
import { ReceiptDokumentkravUploadedItem } from "../../components/receipt-dokumentkrav/ReceiptDokumentkravUploadedItem";
import { Heading } from "@navikt/ds-react";
import styles from "./Pdf.module.css";

interface IProps {
  personalia: IPersonalia;
  dokumentkrav: IDokumentkravList | null;
  showAllFaktumTexts?: boolean;
}

export function Pdf(props: IProps) {
  const { personalia, dokumentkrav, showAllFaktumTexts } = props;
  const { getAppText } = useSanity();
  const { soknadState } = useQuiz();

  return (
    <>
      <PageMeta
        title={getAppText("soknad.side-metadata.tittel")}
        description={getAppText("soknad.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <main>
        <Personalia personalia={personalia} />

        {soknadState.seksjoner.map((section) => (
          <div key={section.beskrivendeId} className="my-11">
            <Section
              key={section.beskrivendeId}
              section={section}
              readonly={true}
              showAllFaktumTexts={showAllFaktumTexts}
            />
          </div>
        ))}

        <div className={styles.dokumentkrav}>
          <Heading spacing size="large" level="2">
            Dokumentkrav
          </Heading>
          <ul>
            {dokumentkrav?.krav.map((krav) => (
              <ReceiptDokumentkravUploadedItem key={krav.beskrivendeId} dokumentkrav={krav} />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
