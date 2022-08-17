import React from "react";

export default function Error404() {
  if (typeof window !== "undefined") {
    window.location.replace("https://www.nav.no/404");
  }
  return <></>;
}
