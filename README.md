# dp-soknad - Søknadsdialog for dagpenger

Frontend-klient for søknad om dagpenger

# Komme i gang

Appen er basert på [Next.js](https://nextjs.org/)

```shell
npm install
npm run dev
```

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

- André Roaldseth, andre.roaldseth@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-dagpenger-dev.

# Testing

```shell
npm run test
```

## Autentisering i dev

1. Gå til https://www.dev.nav.no/person/dittnav/
2. Logg inn (hvis det feiler; clear cookies og cache i browser)
3. Gå til https://arbeid.dev.nav.no/arbeid/dagpenger/soknad
4. Login complete - apiendepunkter skal da fungere

## Kode-konvensjoner

- Bruk engelsk for alt unntatt domenespesifikke termer (eks: faktum, seksjon).
- Filnavn:
  ** Bruk PascalCase for React-komponenter.
  ** Bruk kebab-case for rene ts-filer
- Named exports --> Alle eksporter skal være navngitt (unngå default)
- CSS:
  ** Bruk css-modules - Unngå inline style.
  ** Følg navnekonvensjon for tilhørende komponent.

## Git-konvensjoner

- Multi-line commits --> Første linje beskriver hva som er gjort (kort). Forklar hvorfor endringen er gjort på etterføllgende linjer
- Referer til Github-issue (navikt/dagpenger#[issue-nummer])
