# Quiz på boks
Muliggjøre lokal kjøring av søknadsdialogen og Quiz lokalt.

## Forutsettninger 
* Nødvendig programvare, kan legges inn vha `Brew`: 
  * Colima
  * docker-compose
  * docker
* Github Personal Access Token (PAT) [token](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages), lagret i miljøvariabelen `GITHUB_PAT`.
* `127.0.0.1 host.docker.internal` må være lagt til i `/etc/hosts`

### Opprette PAT hos Github
1. Lag et PAT hos Github, må gjøres fr å kunne laste ned docker-images fra Github sitt pakkerepo.
   1. `Github.com > Settings > Developer settings > Personal access tokens > Generate new token` ([direkte lenke](https://github.com/settings/tokens))
   2. Sørg for at å krysse av for tilgang til å lese pakker.
   3. Etter at tokenet er lagd er det viktig å klikke på "Configure SSO" og velge "Authorize", og deretter følge flyten.
2. Sett tokenet i miljøvariabel `GITHUB_PAT` (`export GITHUB_PAT=<token>`)
3. Logg inn i docker `echo $GITHUB_PAT | docker login ghcr.io -u <BRUKERNAVN> --password-stdin`


### Bruke søknadsdialogen lokalt
1. `docker-compose build` --> bygger de tilnærmet statiske docker-lagene for frontenden. Bla `node_modules`.
2. `docker-compose up -d` --> starter alle containerene i bakgrunnen.
3. Gå til http://localhost:4000/arbeid/dagpenger/soknad/en
4. Du er nå innlogget som den fiktive brukeren `12345678901`


#### Hvordan få frontenden til å snappe opp endringer

##### I egen kode
Gjør eventuelle endringer i kildekoden, disse endringene blir automatisk snappet opp etter cirka 10 sekunder.
Følg gjerne med i loggen for frontenden: `docker-compose logs frontend -f`

##### Endring i avhengigheter
Typisk noe nytt som har kommet inn i `node_modules`. Kjør kommandoen `docker-compose up -d --build`, da vil docker kjøre 
`npm install` på nytt og cache-e resultatet.


### Stoppe alle containere
* `docker-compose down` --> stopper alle kjørende containere, men beholder tilstand i databaser og på kafka. 


### Feilsøking
* Verifisere at alle containere kjører: `docker-compose ps`
* Tail-e loggene for alle containerene: `docker-compose logs -f`
* Hvis oppsettet ikke oppfører seg som forventet kan følgende kommandø kjøres `docker-compose down -v`, det sørger for å
  rydde opp etter tidligere kjøringer.
* Hvis frontenden lugger så kan man kjøre kommandoen `docker-compose build --no-cache`, da tvinger man docker til å 
  bygge frontenden helt på nytt og uten å hente lag som ligger i cache-en. 
