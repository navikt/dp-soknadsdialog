import { useEffect, useState } from "react";

export function useSvgIcon(fileName: string) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await import(`@navikt/ds-icons/svg/${fileName}.svg`);
        setSvg(response.default);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Fant ikke icon");
      }
    };

    fetchSvg();
  }, [fileName]);

  return {
    svg,
  };
}
