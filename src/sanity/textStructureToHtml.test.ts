import { textStructureToHtml } from "./textStructureToHtml";

const sanityTexts = {
  apptekster: [
    {
      textId: "barn.legg-til",
      valueText: "Legg til barn",
    },
  ],
  fakta: [
    {
      description: null,
      helpText: null,
      text: "Legg til barn",
      textId: "faktum.legge-til-egne-barn",
      unit: null,
    },
    {
      description: [
        {
          _key: "287f10e57e09",
          _type: "block",
          children: [
            {
              _key: "6081674ab8930",
              _type: "span",
              marks: [],
              text: "Med bostedsland mener vi ditt vanlige oppholdssted, som er der du eier eller leier bolig og tilbringer mesteparten av tiden din.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      helpText: {
        body: [
          {
            _key: "7ee2031b197e",
            _type: "block",
            children: [
              {
                _key: "2e26d66cd7450",
                _type: "span",
                marks: [],
                text: "Er du usikker på hva du skal svare, kan du lese mer om hvor du skal søke penger fra på ",
              },
              {
                _key: "177efbcb9de0",
                _type: "span",
                marks: ["2e88ac6d615c"],
                text: "nav.no",
              },
              {
                _key: "c0648dc30885",
                _type: "span",
                marks: [],
                text: ".",
              },
            ],
            markDefs: [
              {
                _key: "2e88ac6d615c",
                _type: "link",
                href: "https://www.nav.no/",
              },
            ],
            style: "normal",
          },
        ],
        title: "Har du pendlet mellom flere land?",
      },
      text: "Hvilket land bor du i?",
      textId: "faktum.hvilket-land-bor-du-i",
      unit: null,
    },
  ],
};

test("rekursivt oversetter portable text til html", () => {
  const html = textStructureToHtml(sanityTexts);

  expect(html.apptekster[0].valueText).toBe("Legg til barn");
  expect(html.fakta[0].text).toBe("Legg til barn");
  expect(html.fakta[1].text).toBe("Hvilket land bor du i?");
  expect(html.fakta[1].helpText?.title).toBe("Har du pendlet mellom flere land?");
  expect(html.fakta[1].helpText?.body).toEqual([
    '<p>Er du usikker på hva du skal svare, kan du lese mer om hvor du skal søke penger fra på <a href="https://www.nav.no/">nav.no</a>.</p>',
  ]);
});

test("Håndterer nøkler med verdi", () => {
  const html = textStructureToHtml({ key1: "value" });

  expect(html.key1).toEqual("value");
});

test("Håndterer nøkler med null verdi", () => {
  const html = textStructureToHtml({ key1: "value", key2: null });

  expect(html.key1).toEqual("value");
  expect(html.key2).toBeNull();
});

test("Håndterer rekursive trær", () => {
  const html = textStructureToHtml({ key1: { key2: { key3: "value" } } });

  expect(html.key1.key2.key3).toEqual("value");
});
