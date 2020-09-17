import React from "react";
import { JSDOM } from "jsdom";

export default async function getDekoratøren() {
  const res = await fetch("https://www.nav.no/dekoratoren/");
  const body = await res.text();

  const { document } = new JSDOM(body).window;

  return {
    Styles: styles(),
    Scripts: scripts(),
    Header: <div dangerouslySetInnerHTML={html("header")} />,
    Footer: <div dangerouslySetInnerHTML={html("footer")} />,
  };

  function html(id) {
    return {
      __html: document.getElementById(`${id}-withmenu`)["innerHTML"],
    };
  }

  function styles() {
    return createReactElements(document, "styles");
  }

  function scripts() {
    return createReactElements(document, "scripts");
  }

  function createReactElements(document, id) {
    return Object.values(document.getElementById(id).children).map(
      createReactElement
    );
  }

  function createReactElement(element) {
    const tagName = element.tagName.toLowerCase();
    const attributes = Object.fromEntries(
      Object.values(element.attributes).map((a) => [a.name, a.value])
    );

    if (tagName === "script") {
      attributes.async = true;
    }

    return React.createElement(tagName, attributes);
  }
}
