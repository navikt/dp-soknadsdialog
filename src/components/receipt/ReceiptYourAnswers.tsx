import { Accordion, Heading } from "@navikt/ds-react";
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
      <Heading level="2" size="medium" className={styles.receiptYourAnswersHeader}>
        {getAppTekst("kvittering.dine-svar")}
      </Heading>
      {props.sections?.map((section) => {
        return (
          <div key={section.beskrivendeId}>
            <Accordion.Item key={section.beskrivendeId}>
              <Accordion.Header>
                {getSeksjonTextById(section.beskrivendeId)?.title}
              </Accordion.Header>
              <Accordion.Content>
                <>
                  {section.fakta.map((faktum) => {
                    return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                  })}
                </>
              </Accordion.Content>
            </Accordion.Item>
          </div>
        );
      })}
    </div>
  );
}
