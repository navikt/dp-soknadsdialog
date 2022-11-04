import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useSanity } from "../../context/sanity-context";
import { BodyShort } from "@navikt/ds-react";
import styles from "./FetchIndicator.module.css";

export function FetchIndicator({ isLoading = false }) {
  const { getAppText } = useSanity();
  const [showText, setShowText] = useState(false);
  const [isLoadingInternal, setIsLoadingInternal] = useState(isLoading);
  const [isDelayed, setIsDelayed] = useState(true);
  const initialDelayMs = 250;
  const textDisplayDelayMs = 4500;

  useEffect(() => {
    let textDisplayTimer: NodeJS.Timeout | undefined;
    let delayTimer: NodeJS.Timeout | undefined;
    if (isLoading) {
      setIsLoadingInternal(isLoading);
      textDisplayTimer = setTimeout(() => {
        setShowText(true);
      }, textDisplayDelayMs);
      delayTimer = setTimeout(() => {
        setIsDelayed(false);
      }, initialDelayMs);
    } else {
      setIsLoadingInternal(isLoading);
      setIsDelayed(true);
      setShowText(false);
    }

    return () => {
      clearTimeout(textDisplayTimer);
      clearTimeout(delayTimer);
    };
  }, [isLoading]);

  return (
    <div className={styles.loader}>
      {isLoadingInternal && !isDelayed && (
        <>
          <div className={styles.dots}>
            <div className={styles.dotContainer}>
              <div className={classNames(styles.dot, styles.dot1)}></div>
            </div>
            <div className={styles.dotContainer}>
              <div className={classNames(styles.dot, styles.dot2)}></div>
            </div>
            <div className={styles.dotContainer}>
              <div className={classNames(styles.dot, styles.dot3)}></div>
            </div>
          </div>
          {showText && (
            <BodyShort tabIndex={0}>{getAppText("soknad.loader.laster-neste")}</BodyShort>
          )}
        </>
      )}
    </div>
  );
}
