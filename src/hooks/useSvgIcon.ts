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

  return {
    svg,
  };
}
