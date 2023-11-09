# dp-soknadsdialog - Søknadsdialog for dagpenger

Frontend-klient for søknad om dagpenger

## Komme i gang

Appen er basert på [Next.js](https://nextjs.org/)

**For Mac OSX**

```shell
npm install
npm run setup-env
npm run generate-token
npm run dev
```

**For Windows**

```shell
npm install
npm run setup-env
npm run generate-token-win
npm run dev
```

`npm run setup-env` lager en `.env.development` som er nødvendig for kunne kjøre opp applikasjonen lokalt.

`npm run generate-token` genererer lokal token til `.env.development` fil og bruker det til å hente data fra dev-miljøet. Toknene er gyldig mellom 30 minutter til en time, kjør kommandoen på nytt dersom tokene er utløpt.

## Kjøre localhost med mock data

For å kjøre localhost med mock data kan du enkelt sette `USE_MOCKS="true"` i `.env.development` filen og restart localhost på nytt.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

- André Roaldseth, andre.roaldseth@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-dagpenger-dev.

## Testing

```shell
npm run test
```

## Kode-konvensjoner

- Bruk engelsk for alt unntatt domenespesifikke termer (eks: faktum, seksjon).
- Filnavn:
  - Bruk PascalCase for React-komponenter.
  - Bruk kebab-case for rene ts-filer
- Named exports --> Alle eksporter skal være navngitt (unngå default)
- CSS:
  - Bruk css-modules - Unngå inline style.
  - Følg navnekonvensjon for tilhørende komponent.

## Git-konvensjoner

- Multi-line commits --> Første linje beskriver hva som er gjort (kort). Forklar hvorfor endringen er gjort på etterføllgende linjer
- Referer til Github-issue (navikt/dagpenger#[issue-nummer])

## Potensielle errorer

### UUID error

`ERROR (14669): Get new uuid - Failed to get new uuid from dp-soknad: Bad Request, uuid: Not provided`

Husk å `Flush socket pools` via chrome://net-internals/#sockets. Gjør dette, og gjør hele [Vanlig oppstart](https://github.com/navikt/dp-soknadsdialog/tree/oppdatertDokumentasjon#vanlig-oppstart-av-prosjektet-n%C3%A5r-alt-er-satt-opp) på nytt
