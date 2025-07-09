# abbr-title-tap

This tiny package brings native-like `<abbr title="...">` hover behavior from desktop browsers to mobile. It displays the title text near the `abbr` tag on tap, and hides it when tapping elsewhere.

## Development

- [Requirements](./.a&cd/requirements.md)


### Running Tests

- Automated (Playwright): `npm run test:e2e` will run test from `tests/e2e` folder. Used for unit/integration tests;
- Manual: `run:test:manual` will start the server on `localhost:3000` serving the html from `tests/manual/index.html` and scripts from `tests/.builds`. Used for manual acceptance testing.