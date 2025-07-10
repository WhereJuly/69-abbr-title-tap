# abbr-title-tap

This tiny package drop-in brings native-like `<abbr title="...">` hover behavior from desktop browsers to mobile. It displays the title text near the `abbr` tag on tap, and hides it when tapping elsewhere.

**Package Status**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=WhereJuly_69-abbr-title-tap&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=WhereJuly_69-abbr-title-tap)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=WhereJuly_69-abbr-title-tap&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=WhereJuly_69-abbr-title-tap)
![npm bundle size](https://img.shields.io/bundlephobia/min/abbr-title-tap)
![npm minzip size](https://img.shields.io/bundlephobia/minzip/abbr-title-tap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=green)](https://opensource.org/licenses/MIT)

## Installation

**CDN (Browser)**

Add this in your `index.html` `head` tag. This makes it work as soon as your page loads.

```html
<!-- From unpkg -->
<script src="https://unpkg.com/abbr-title-tap"></script>
<link rel="stylesheet" href="https://unpkg.com/abbr-title-tap/styles.min.css" />
```

## Programmatic Usage

For programmatic usage install it via **npm**:

```bash
npm install abbr-title-tap
```

If not run vial HTML, then import the package code and styles like this.

```typescript
import 'abbr-title-tap/styles.css';
import 'abbr-title-tap';
```

Alternatively, the following will do the same as the `script` tag above in HTML. CSS should be imported as well. Note, either way, it runs a singleton so that just a single `TapDetector` class instance is run.

```typescript
import 'abbr-title-tap/styles.css';

import { Init } from 'abbr-title-tap';

new Init();
```

### Advanced

This is the manual initialization. This is not anymore a singleton, so ensure you do not create multiple redundant `TapDetector` instances.

```typescript
import { AbbrTapHandler, TapDetector } from 'abbr-title-tap';

new TapDetector(document, 'abbr', new AbbrTapHandler());
```

Formally you could listen to a tap event on any selector you want and provide your own custom tap handler. See the `TapDetector`, `ATapHandler` and `AbbrTapHandler` classes JSDoc hoverable blocks for more info and dig in the source.

You could also instantiate multiple `TapDetector` instances for handling different HTML selectors with a different handlers (not tested actually).

## Development

- [Requirements](./.a&cd/requirements.md)

### Running Tests

- Automated (Playwright): `npm run test:e2e` will run test from `tests/e2e` folder. Used for unit/integration tests;
- Manual acceptance testing: `npm run run:test:manual` will start the server on `localhost:3000` serving the html from `tests/manual/index.html` and scripts from `tests/.builds`. Used for manual acceptance testing. The script rebuilds the engaged dependencies to refresh imported files on each run.

## Maintenance

The package is written in TypeScript with the informative JSDoc blocks available on hover for public interface (e.g. in VS Code) for comfortable programmatic usage. The code is carefully crafted with TDD allowing simple extension. The project is production-ready and actively maintained.

### Contributions

Filling issues, questions in Discussions are all welcome.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
