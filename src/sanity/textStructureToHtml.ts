import { toHTML } from "@portabletext/to-html";
import { isPortableTextBlock } from "@portabletext/toolkit";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function textStructureToHtml<T extends Record<string, any>>(textStructure: T): T {
  let key: keyof T, value: any;

  for ([key, value] of Object.entries(textStructure)) {
    if (value === null) continue;
    if (typeof value === "string") continue;
    if (typeof value === "object" && isPortableTextBlock(value)) {
      textStructure[key] = toHTML(value) as any;
      continue;
    }

    textStructureToHtml(value);
  }

  return textStructure;
}
