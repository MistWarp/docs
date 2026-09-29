---
title: Testing
sidebar_position: 4
---

# Testing

MistWarp inherits Scratch's test setup: [Jest](https://jestjs.io/) in scratch-gui and [tap](https://node-tap.io/) in scratch-vm. This page lists the suites and how to run them.

## scratch-gui

### What CI runs

Every pull request to scratch-gui runs these checks. Run them locally to reproduce CI:

```bash
pnpm run deps:check
pnpm run i18n:community:check
pnpm run i18n:editor:check
pnpm run test:unit:ci
MW_COMMUNITY=true pnpm run build
node scripts/validate-deploy.mjs build
```

- `deps:check` fails when a fork in `package.json` is not pinned to a commit, has a `link:` override, or disagrees with `pnpm-lock.yaml`. It only warns when a pin is behind the fork's `develop`. Fix either with `pnpm run deps:sync`.
- `i18n:editor:check` fails when an editor `defaultMessage` changed without an update to `src/lib/tw-translations/default-messages.json`. Fix it with `pnpm run i18n:editor:extract` and commit the result.
- `i18n:community:check` fails when a community string is missing from `src/community/translations/en.json`, or a translation has placeholders that do not match. `pnpm run i18n:community:extract` adds new strings.
- `validate-deploy.mjs` checks that every script and stylesheet the built HTML references exists.

A community build may need `NODE_OPTIONS=--max-old-space-size=7168`.

### Linting

```bash
pnpm run lint              # eslint .
npx eslint <files>         # just the files you changed
pnpm run check:community-css
```

`check:community-css` checks that community CSS uses the shared tokens in `src/community/styles/tokens.module.css`. Run it after editing CSS under `src/community`.

### Unit tests

The unit tests live under `test/unit/`. They run with Jest and Enzyme (React 16) in jsdom.

```bash
pnpm run test:unit          # every suite under test/unit
pnpm run test:unit:watch    # the same, rerunning as files change
pnpm run test:unit:addons   # test/unit/addons only
pnpm run test:collab        # test/unit/collaboration only
npx jest test/unit/<path>   # one file or folder
```

`pnpm run test:collab` covers the collaboration engine under `src/lib/collaboration/` and is the suite to run when working on live collaboration.

### Integration tests

Integration tests under `test/integration/` drive Chrome through Selenium against a production build. `pnpm run test:integration` serves `build/` with Vite's preview server and runs them:

```bash
pnpm run build
pnpm run test:integration
```

To run one file, serve the build with `pnpm run preview` in another terminal, then run Jest directly. The tests use `http://localhost:8601` unless `TEST_BASE_URL` says otherwise.

```bash
npx jest --runInBand test/integration/backpack.test.js
USE_HEADLESS=no npx jest --runInBand test/integration/backpack.test.js   # watch the browser
```

The tests need a Chrome and a `chromedriver` of the same major version. `CHROME_BIN` and `CHROMEDRIVER_BIN` point the tests at a specific Chrome or chromedriver, such as a Chrome for Testing download.

`pnpm test` runs the unit tests, a build, and the integration tests in one go.

## scratch-vm

scratch-vm uses tap. From the scratch-vm checkout:

```bash
npm run tap            # unit and integration tests
npm run tap:unit       # unit tests only
npm run tap:integration
npx tap test/unit/<file>.js   # a single file
```

The VM is where blocks and the compiler live, so this is the suite to run when changing runtime behavior. When adding or changing a block, add or update a fixture under `test/` so the behavior is pinned.

## What to test

- Changing a block or the compiler: add a scratch-vm tap test.
- Changing collaboration: run `pnpm run test:collab`.
- Changing a React component or container: add a Jest unit test under `test/unit/`.
- Anything user-facing that touches the browser: consider an integration test.

## See also

- [Building and Running](/contributing/building-running)
- [Contributing](/contributing/guidelines)
