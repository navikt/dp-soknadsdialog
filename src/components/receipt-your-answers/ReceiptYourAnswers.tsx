import { Accordion, ReadMore } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { IPersonalia } from "../../types/personalia.types";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import { Personalia } from "../personalia/Personalia";
import styles from "./ReceiptYourAnswers.module.css";

interface IProps {
  sections: IQuizSeksjon[];
  personalia: IPersonalia | null;
}

export function ReceiptYourAnswers(props: IProps) {
  const { sections, personalia } = props;
  const { getAppText, getSeksjonTextById } = useSanity();

  const textPersonaliaId = "personalia";
  const personaliaTexts = getSeksjonTextById(textPersonaliaId);

  return (
    <div className={styles.receiptYourAnswersContainer}>
      <ReadMore
        className={styles.receiptYourAnswersHeader}
        header={getAppText("kvittering.dine-svar.header")}
      >
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
        {sections?.map((section) => {
          return (
            <Accordion.Item key={section.beskrivendeId}>
              <Accordion.Header>
                {getSeksjonTextById(section.beskrivendeId)?.title}
              </Accordion.Header>
              <Accordion.Content>
                {section.fakta.map((faktum) => {
                  return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                })}
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </ReadMore>
    </div>
  );
}
