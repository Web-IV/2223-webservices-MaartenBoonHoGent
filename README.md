# Examenopdracht Web Services
- Student: Maarten Boon
- Studentennummer: 202185123
- E-mailadres: maarten.boon@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [npm](https://www.npmjs.com)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten

.env aanmaken: bestand heeft volgende attributen
- NODE_ENV
- PORT 
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_NAME
- AUTH_JWKS_URI
- AUTH_AUDIENCE
- AUTH_ISSUER
- AUTH_USER_INFO
- AUTH_TOKEN_URL
- AUTH_CLIENT_ID
- AUTH_CLIENT_SECRET
- AUTH_TEST_USER_USERNAME
- AUTH_TEST_USER_PASSWORD

<br>.env.test aanmaken: bestand heeft dezelfde attributen - dit een environment voor de testen

<br>Zorg ervoor dat de database-connectie geconfigureerd is.
voer een `yarn install` uit.

## Testen

- Zorg ervoor dat jest geïnstalleerd is
- Zorg ervoor dat de database-connectie geconfigureerd is
- Zorg ervoor dat de test-gebruiker bestaat in auth0 met de juiste rechten: read, write

<br>Om de testen uit te voeren, voer volgende commando uit:
`yarn test`
<br>Om de testen uit te voeren met coverage, voer volgende commando uit:
`yarn test:coverage`
