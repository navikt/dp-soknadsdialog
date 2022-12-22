import { Label } from "@navikt/ds-react";
import { useEffect, useRef } from "react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./ProgressBar.module.css";

interface IProgressBar {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar(props: IProgressBar) {
  const progressbarRef = useRef(null);
  const { setFocus } = useSetFocus();
  const { scrollIntoView } = useScrollIntoView();

  useEffect(() => {
    scrollIntoView(progressbarRef);
    setFocus(progressbarRef);
  }, [props.currentStep]);

  const progressPercentage = () => {
    return (props.currentStep / props.totalSteps) * 100;
  };

  const renderRemaining = () => {
    const remainingProgress = 100 - progressPercentage();
    const remainderWidthStyle = { width: `${remainingProgress}%` };

    let finalCircleStyle = {};
    if (props.currentStep === props.totalSteps) {
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

  return (
    <div
      ref={progressbarRef}
      className={styles.progressBar}
      role={"progressbar"}
      aria-valuenow={props.currentStep}
      aria-valuemin={1}
      aria-valuemax={props.totalSteps}
      tabIndex={-1}
      aria-labelledby="progressbar"
    >
      <Label spacing id="progressbar">
        {`Steg ${props.currentStep} av ${props.totalSteps}`}
      </Label>
      <div className={styles.barContainer}>
        {renderCompletedSteps()}
        {renderRemaining()}
      </div>
    </div>
  );
}
