import React from "react";
import Error from "../components/error/Error";

export default function Error404() {
  return (
    <Error
      variant="info"
      title="Siden finnes ikke"
      details="Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit."
    />
  );
}
