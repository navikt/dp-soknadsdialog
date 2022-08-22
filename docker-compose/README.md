# Quiz på boks
Muliggjøre lokal kjøring av søknadsdialogen og quiz lokalt.

## Forutsettninger 
* Nødvendig programvare, kan legges inn vha Brew: 
  * Colima
  * docker-compose 
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
2. Vent til dp-soknad er klar. 
   * Kjør `docker-compose logs soknad -f` og se etter `"Mottatt søknadsmal med versjon_navn Dagpenger og versjon_id XXX"`
3. Gå til http://localhost:4000/arbeid/dagpenger/soknad/en, i feltet `Optional claims JSON value` fyll inn følgende:
```json
{
"pid": "12345678901"
}
```
4. I feltet `Enter any user/subject` fylles det samme fødselsnummeret inn som ble brukt i steg 3: `12345678901`
5. Klikk på Sign-in.

NB! Det er opprettet en egen [oppgave](https://jira.adeo.no/browse/DAG-340) på å automatisere steg 3-5.

#### Hvordan få frontenden til å snappe opp endringer
1. Gjør endringene i kildekoden
2. Kjør kommandoen:
   ```docker-compose restart frontend```
4. Etter cirka 20 sekunder vil nettleseren refreshe appen, og endringene vil bli vist.
   * Hvis du er nysgjerrig på hva som skjer kan man kjøre følgende kommando for å følge med: `docker-compose logs frontend -f`


### Stoppe alle containere
* `docker-compose down` --> stopper alle kjørende containere, men beholder tilstand i databaser og på kafka. 


### Feilsøking
* Verifisere at alle containere kjører: `docker-compose ps`
* Tail-e loggene for alle containerene: `docker-compose logs -f`
* Hvis oppsettet ikke oppfører seg som forventet kan følgende kommandø kjøres `docker-compose down -v`, det sørger for å
  rydde opp etter tidligere kjøringer.
