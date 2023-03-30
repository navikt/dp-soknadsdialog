# dp-soknadsdialog - Søknadsdialog for dagpenger

Frontend-klient for søknad om dagpenger

# Komme i gang

Appen er basert på [Next.js](https://nextjs.org/)

```shell
npm install
npm run dev
```

For å kjøre i localhost med mockede data må man sette en prosess-variabel i `src/.env.local`. Denne fila må sannsynligvis opprettes første gang, og skal ikke sjekkes inn i git.
```
NEXT_PUBLIC_LOCALHOST=true
```

Åpne applikasjonen med å gå til http://localhost:3000/dagpenger/dialog/soknad.

Vi kan også kjøre localhost direkte mot backend-tjenestene i dev-gcp. Dette gjøres ved å [sette opp custom config med gcloud og kubectx](#for-å-teste-mot-dev).

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

- André Roaldseth, andre.roaldseth@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-dagpenger-dev.

---

# Testing

```shell
npm run test
```

## Testing med watch

```shell
npm run test -- --watch
```

## Code coverage

```shell
npm run test-coverage
```

## Kode-konvensjoner

- Bruk engelsk for alt unntatt domenespesifikke termer (eks: faktum, seksjon).
- Filnavn:
  * Bruk PascalCase for React-komponenter.
  * Bruk kebab-case for rene ts-filer
- Named exports --> Alle eksporter skal være navngitt (unngå default)
- CSS:
  * Bruk css-modules - Unngå inline style.
  * Følg navnekonvensjon for tilhørende komponent.

## Git-konvensjoner

- Multi-line commits --> Første linje beskriver hva som er gjort (kort). Forklar hvorfor endringen er gjort på etterføllgende linjer
- Referer til Github-issue (navikt/dagpenger#[issue-nummer])


## For å teste mot dev
1. Gå til https://myapplications.microsoft.com/ og be om tilgang til `Google Cloud Platform`
2. Installer disse:
```shell
brew install Kubectx 
brew install Kubectx Kubectl 
brew install google-cloud-sdk
```
3. ```git clone https://github.com/navikt/kubeconfigs```
4. Legg til følgende i ~/.zshrc:
```shell
export KUBECONFIG="<path-to>/kubeconfigs/config"
```
5. Kjør disse i terminal:
```shell
gcloud auth login
gcloud config set project teamdagpenger-dev-885f
kubectx dev-gcp
```
6. Kjør: 
```shell
npm run port-forward
npm run dev
```
