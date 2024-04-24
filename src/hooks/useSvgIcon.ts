import { logger } from "@navikt/next-logger";
import { useEffect, useState } from "react";

export function useSvgIcon(fileName: string) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await import(`@navikt/ds-icons/svg/${fileName}.svg`);
        setSvg(response.default);
      } catch (err) {
        logger.error(`Did not find icon with name: ${fileName}`);
      }
    };

    fetchSvg();
  }, [fileName]);

  // Invalid value for prop `$$typeof` on <svg> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM.
  // For details, see https://reactjs.org/link/attribute-behavior
  // if (svg) {
  //   //@ts-ignore
  //   // eslint-disable-next-line
  //   let { ["$$typeof"]: _, ...rest } = svg;
  //   return { rest };
  // }

  return {
    svg,
  };
}
