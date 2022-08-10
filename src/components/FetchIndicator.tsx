import React, { useEffect, useState } from "react";
import styles from "./FetchIndicator.module.css";
import { useSanity } from "../context/sanity-context";
import classNames from "classnames";
import { BodyShort } from "@navikt/ds-react";

export function FetchIndicator({ isLoading = false }) {
  const { getAppTekst } = useSanity();
  const [showText, setShowText] = useState(false);
  const [isLoadingInternal, setIsLoadingInternal] = useState(isLoading);
  const textDisplayDelayMs = 1500;

  useEffect(() => {
    if (isLoading) {
      setIsLoadingInternal(isLoading);
      setTimeout(() => {
        setShowText(true);
      }, textDisplayDelayMs);
    }
  }, [isLoading]);

  return (
    <>
      {isLoadingInternal && (
        <div className={styles.loader}>
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
          {showText && <BodyShort tabIndex={0}>{getAppTekst("laster-sporsmal.tittel")}</BodyShort>}
        </div>
      )}
    </>
  );
}
