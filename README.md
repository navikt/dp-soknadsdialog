# dp-soknadsdialog - Søknadsdialog for dagpenger

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

## For å teste mot dev

1. Gå til https://myapplications.microsoft.com/ og be om tilgang til `Google Cloud Platform`
2. Installer disse:

```shell
brew install Kubectx
brew install Kubectx Kubectl
brew install google-cloud-sdk
```

3. `git clone https://github.com/navikt/kubeconfigs`
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

## Vanlig oppstart av prosjektet (når alt er satt opp)

Tilleggs info, det er lurt å bruke Chrome i denne løsningen da Firefox ikke fungerer på selve søknadsdialog-biten.

1. Start opp Naisdevice (den må bli grønn)
2. `$ gcloud auth login`
3. Login med @nav.no e-post
4. Trykk Tillat
5. `$ npm run port-forward`
6. Klikk på https://arbeid.intern.dev.nav.no/dagpenger/dialog og logg inn med ID (via Dolly)
7. Klikk på https://arbeid.intern.dev.nav.no/dagpenger/dialog/api/internal/token og paste inn token i terminalen
8. `$ npm run dev`
9. Gå til http://localhost:3000/dagpenger/dialog/soknad/arbeidssoker
10. Ferdig!

## Potensielle errorer

### gke-gcloud-auth-plugin error

````Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
Unable to connect to the server: getting credentials: exec: executable gke-gcloud-auth-plugin not found```

Løsningen er å legge inn `source "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc"` inn i `.zshrc` på Mac.

Årsaken oppstår mulig fordi Kubernetes kjører en gammel versjon og når man tar en `brew update/upgrade` så blir det en mismatch og gjør at den ikke klarer å kjøre.

### UUID error

```ERROR (14669): Get new uuid - Failed to get new uuid from dp-soknad: Bad Request, uuid: Not provided```

Husk å `Flush socket pools` via chrome://net-internals/#sockets. Gjør dette, og gjør hele Vanlig oppstart på nytt
````
