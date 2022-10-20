import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useSanity } from "../../context/sanity-context";
import { BodyShort } from "@navikt/ds-react";
import styles from "./FetchIndicator.module.css";

export function FetchIndicator({ isLoading = false }) {
  const { getAppText } = useSanity();
  const [showText, setShowText] = useState(false);
  const [isLoadingInternal, setIsLoadingInternal] = useState(isLoading);
  const textDisplayDelayMs = 4500;

  useEffect(() => {
    if (isLoading) {
      setIsLoadingInternal(isLoading);
      setTimeout(() => {
        setShowText(true);
      }, textDisplayDelayMs);
    } else {
      setIsLoadingInternal(isLoading);
      setShowText(false);
    }
  }, [isLoading]);

  return (
    <div className={styles.loader}>
      {isLoadingInternal && (
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
