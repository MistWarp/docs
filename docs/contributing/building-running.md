---
title: Building and Running
sidebar_position: 3
---

# Building and Running

This page walks through running the MistWarp editor and community site locally. Most development happens in scratch-gui, so that is where it starts. The engine packages come after.

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22, the version in scratch-gui's `.nvmrc`. 20.19 is the minimum.
- [pnpm](https://pnpm.io/) 10. scratch-gui pins the exact version in `package.json`, so the easiest way to get it is `corepack enable`, which ships with Node.

The first install and the first start need an internet connection.

## Run scratch-gui

```bash
git clone https://github.com/MistWarp/scratch-gui
cd scratch-gui
pnpm install
cp .env.example .env
pnpm start
```

`pnpm start` runs the [Vite](https://vite.dev/) dev server on port 8601. `.env.example` sets `MW_COMMUNITY=true`, which turns on the community site:

- [http://localhost:8601/](http://localhost:8601/) is the community site.
- [http://localhost:8601/editor](http://localhost:8601/editor) is the editor.

Without a `.env`, the editor is served at `/` and the community pages are left out. Set `PORT` to use another port.

The dev server mirrors the production routes, so `/embed.html`, `/fullscreen`, `/addons`, `/credits`, and the community client routes work too. The community site talks to the live API at `https://api.mistwarp.org/v1`, so real projects and profiles load without running a backend.

On its first start, Vite writes generated sources into `src/generated/` (locales, scratch-blocks, and the micro:bit firmware URL) and downloads the micro:bit HEX file into `static/microbit/`. Later starts work offline. React components and CSS reload as you edit them.

## Production build

```bash
pnpm run build
pnpm run preview
```

`pnpm run build` writes the site to `build/`. `pnpm run preview` serves that folder on port 8601. The pages are ES modules, so open them through a server, not as `file://` URLs.

A community build needs more memory than Node's default heap. If it runs out, raise the limit:

```bash
MW_COMMUNITY=true NODE_OPTIONS=--max-old-space-size=7168 pnpm run build
```

Other build scripts:

- `pnpm run build:editor` builds only the editor, as one bundle.
- `pnpm run build:community` builds only the community site.
- `pnpm run build:library` builds the GUI as a library into `dist/`. `pnpm run build:all` builds the site and the library.
- `pnpm run build:stats` and `pnpm run build:report` report bundle sizes.

The scratch-gui README lists the environment variables the build reads.

## Linting and formatting

```bash
pnpm run lint   # eslint .
pnpm run fmt    # eslint --fix .
```

For a quick check, lint just the files you changed with `npx eslint <files>`. See [Contributing](/contributing/guidelines) for the style rules the linter does not catch.

## Working on the engine packages

scratch-gui depends on MistWarp forks of scratch-vm, scratch-blocks, scratch-render, scratch-paint, and scratch-audio. `package.json` pins each one to a commit, so scratch-gui builds on its own with no other checkouts.

To change one of them, clone it next to scratch-gui and link it:

```bash
cd ..
git clone https://github.com/MistWarp/scratch-vm
cd scratch-gui
pnpm run link
```

`pnpm run link` symlinks each fork that is checked out next to scratch-gui into `node_modules` and skips the ones that are not. It does not edit `package.json`. Restart `pnpm start` after linking. `pnpm run unlink`, or another `pnpm install`, goes back to the pinned copies. `pnpm run reinstall` forces a fresh install and links again.

Once a fork change is merged into that fork's `develop`, `pnpm run deps:sync` moves scratch-gui's pins to the latest `develop` of every fork, and `pnpm run deps:check` reports pins that are behind.

### scratch-vm

scratch-vm uses npm and its own scripts:

```bash
cd scratch-vm
npm install
npm run lint
npm run tap          # all tests
npm run tap:unit     # unit tests only
npx tap test/unit/<file>.js   # a single file
```

### scratch-blocks

scratch-blocks commits its compiled Closure output. Edits under `core/` need a Closure recompile, which needs Java and Python. With `node_modules/.bin` on your `PATH`, run:

```bash
node universal-python.js build.py
```

Any new symbols you add must be exported in the `goog.global` block, or Closure will strip them from the build.

### mistwarp-api

The community backend is an OSL service. With the OSL interpreter installed:

```bash
cd mistwarp-api
cp .env.example .env
osl run main.osl   # listens on PORT, 5627 by default
```

It stores data as flat JSON under `data/` and keeps project files in a local `data/blobs/` directory when no R2 bucket is configured. scratch-gui always talks to `https://api.mistwarp.org/v1` (`API_BASE` in `src/lib/community/api.js`), so change that constant locally to use your own backend.

## See also

- [Project Structure](/contributing/project-structure)
- [Testing](/contributing/testing)
- [Deploying](/contributing/deploying)
