import { Accordion, ReadMore } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { IQuizSeksjon } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";
import styles from "./ReceiptYourAnswers.module.css";

interface IProps {
  sections: IQuizSeksjon[];
}

export function ReceiptYourAnswers(props: IProps) {
  const { getAppText, getSeksjonTextById } = useSanity();

  return (
    <div className={styles.receiptYourAnswersContainer}>
      <ReadMore
        className={styles.receiptYourAnswersHeader}
        header={getAppText("kvittering.dine-svar.header")}
      >
        {props.sections?.map((section) => {
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
