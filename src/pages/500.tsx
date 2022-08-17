import React, { useEffect } from "react";
import Error from "../components/error/Error";

export default function Error500() {
  useEffect(() => {
    const localStorageErrorsCount = localStorage.getItem("errorsCount");

    if (localStorageErrorsCount) {
      localStorage.removeItem("errorsCount");
    }
  }, []);

  return (
    <Error
      variant="error"
      title="Beklager, det skjedde en teknisk feil."
      details="Vi jobber med å løse den så raskt som mulig. Prøv igjen
        om litt."
    />
  );
}
