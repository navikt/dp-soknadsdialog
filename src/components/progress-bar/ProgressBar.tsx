import { Label } from "@navikt/ds-react";
import { useEffect, useRef } from "react";
import { useSanity } from "../../context/sanity-context";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./ProgressBar.module.css";

interface IProgressBar {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar(props: IProgressBar) {
  const { currentStep, totalSteps } = props;

  const progressbarRef = useRef(null);
  const { setFocus } = useSetFocus();
  const { scrollIntoView } = useScrollIntoView();
  const { getAppText } = useSanity();

  useEffect(() => {
    scrollIntoView(progressbarRef);
    setFocus(progressbarRef);
  }, [currentStep]);

  const progressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const renderRemaining = () => {
    const remainingProgress = 100 - progressPercentage();
    const remainderWidthStyle = { width: `${remainingProgress}%` };

    let finalCircleStyle = {};
    if (currentStep === totalSteps) {
      finalCircleStyle = { borderWidth: `0px`, borderColor: "transparent" };
    }

    return (
      <div className={styles.remaining} style={remainderWidthStyle}>
        <div className={styles.remainingLine}></div>
        <div className={styles.finalCircle} style={finalCircleStyle}></div>
      </div>
    );
  };

  const renderCompletedSteps = () => {
    const completedWidthStyle = {
      width: `${progressPercentage()}%`,
    };
    return <div className={styles.completed} style={completedWidthStyle}></div>;
  };

  const currentStepText = `${getAppText("steg-indikator.naavaerende-steg.tekst")} ${currentStep}`;

  const ofTotalStepText = `${getAppText("steg-indikator.av-totalt-steg.tekst")} ${totalSteps}`;

  const stepText = `${currentStepText} ${ofTotalStepText}`;

  return (
    <div className={styles.progressBar}>
      <Label ref={progressbarRef} tabIndex={-1} spacing>
        {stepText}
      </Label>
      <div className={styles.barContainer} aria-hidden>
        {renderCompletedSteps()}
        {renderRemaining()}
      </div>
    </div>
  );
}
