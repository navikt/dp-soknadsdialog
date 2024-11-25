import { Accordion, ReadMore } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { IPersonalia } from "../../types/personalia.types";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import { Personalia } from "../personalia/Personalia";
import styles from "./ReceiptYourAnswers.module.css";
import { IOrkestratorSeksjon } from "../../types/orkestrator.types";
import { mapOrkestratorToQuiz } from "../../utils/orkestrator.util";

interface IProps {
  quizSections: IQuizSeksjon[];
  orkestratorSections: IOrkestratorSeksjon[];
  personalia: IPersonalia | null;
}

export function ReceiptYourAnswers(props: IProps) {
  const { quizSections, orkestratorSections, personalia } = props;
  const { getAppText, getSeksjonTextById } = useSanity();

  const textPersonaliaId = "personalia";
  const personaliaTexts = getSeksjonTextById(textPersonaliaId);

  return (
    <div className={styles.receiptYourAnswersContainer}>
      <ReadMore
        className={styles.receiptYourAnswersHeader}
        header={getAppText("kvittering.dine-svar.header")}
      >
        <Accordion>
          {personalia && (
            <Accordion.Item>
              <Accordion.Header>
                {personaliaTexts?.title ? personaliaTexts.title : textPersonaliaId}
              </Accordion.Header>
              <Accordion.Content>
                <Personalia personalia={personalia} mode="summary" />
              </Accordion.Content>
            </Accordion.Item>
          )}

          {orkestratorSections?.map((section) => {
            const sectionTexts = getSeksjonTextById(section.navn);

            return (
              <Accordion.Item key={section.navn}>
                <Accordion.Header>
                  {sectionTexts?.title ? sectionTexts?.title : section.navn}
                </Accordion.Header>
                <Accordion.Content>
                  {section.besvarteOpplysninger.map((opplysning) => {
                    const opplysningToFaktum = mapOrkestratorToQuiz(opplysning);

                    return (
                      <Faktum
                        key={opplysning.opplysningId}
                        faktum={opplysningToFaktum}
                        readonly={true}
                      />
                    );
                  })}
                </Accordion.Content>
              </Accordion.Item>
            );
          })}

          {quizSections?.map((section) => {
            const sectionTexts = getSeksjonTextById(section.beskrivendeId);

            return (
              <Accordion.Item key={section.beskrivendeId}>
                <Accordion.Header>
                  {sectionTexts?.title ? sectionTexts?.title : section.beskrivendeId}
                </Accordion.Header>
                <Accordion.Content>
                  {section.fakta.map((faktum) => {
                    return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                  })}
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </ReadMore>
    </div>
  );
}
