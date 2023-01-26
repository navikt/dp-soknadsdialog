import { Alert } from "@navikt/ds-react";
import { subWeeks } from "date-fns";
import { useSanity } from "../../../context/sanity-context";
import { FormattedDate } from "../../FormattedDate";
import styles from "../Faktum.module.css";

interface IProps {
  selectedDate: string;
}

export function FaktumDatoWarning({ selectedDate }: IProps) {
  const { getAppText } = useSanity();
  const earliestApplicationDate = selectedDate && subWeeks(new Date(selectedDate), 2);

  return (
    <Alert
      data-testid="faktum.soknadsdato-varsel"
      variant="warning"
      className={styles.faktumDatoWarningSpacing}
    >
      {getAppText("validering.dato-faktum.soknadsdato-varsel.start-tekst")}
      <div className={styles.faktumDatoWarningSuggestedDate}>
        <FormattedDate date={earliestApplicationDate as string} short />
        {" - "}
        <FormattedDate date={selectedDate as string} short />
      </div>
      {getAppText("validering.dato-faktum.soknadsdato-varsel.slutt-tekst")}
    </Alert>
  );
}
