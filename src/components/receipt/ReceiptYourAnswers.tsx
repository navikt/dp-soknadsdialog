import { Accordion } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import styles from "./ReceiptYourAnswers.module.css";

interface IProps {
  sections: IQuizSeksjon[];
}

export function ReceiptYourAnswers(props: IProps) {
  const { getAppTekst, getSeksjonTextById } = useSanity();

  return (
    <div className={styles.receiptYourAnswersContainer}>
      <Accordion.Item>
        <Accordion.Header className={styles.receiptYourAnswersHeader}>
          {getAppTekst("kvittering.dine-svar")}
        </Accordion.Header>
        <Accordion.Content className={styles.receiptYourAnswersAccordion}>
          {props.sections?.map((section) => {
            return (
              <div key={section.beskrivendeId}>
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
              </div>
            );
          })}
        </Accordion.Content>
      </Accordion.Item>
    </div>
  );
}
