import React from "react";
import styles from "./ProgressBar.module.css";
import { Label } from "@navikt/ds-react";

interface IProgressBar {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar(props: IProgressBar) {
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
      className={styles.progressBar}
      role={"progressbar"}
      aria-valuenow={props.currentStep}
      aria-valuemin={1}
      aria-valuemax={props.totalSteps}
    >
      <Label spacing>
        Steg {props.currentStep} av {props.totalSteps}
      </Label>
      <div className={styles.barContainer}>
        {renderCompletedSteps()}
        {renderRemaining()}
      </div>
    </div>
  );
}
