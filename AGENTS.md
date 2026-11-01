# MistWarp docs

The documentation site for MistWarp, built with Docusaurus. It is served at
https://mistwarp.org/docs/ (`baseUrl: '/docs/'`, `trailingSlash: true`) and also
inside the editor's Help window, which loads it in a same-origin iframe.

## How it ships

- Cloudflare Pages builds `master` with `npm run build`. `scripts/pack-build.mjs`
  then writes `docs-build.tar.gz` (the build with `index.html` at its root) and
  `docs-build.json` (`{commit, branch}`), which scratch-gui's Cloudflare build
  downloads from docs.warp.mistium.com. Keep both names and that layout.
- `plugins/search-index.js` writes the Pagefind index into `build/pagefind/`
  after `docusaurus build`. Search only works in a build, not in `npm start`.

## Structure

- Pages live in `docs/<section>/<page>.md`. The folder sets the URL, so
  `docs/editor/stage.md` is `/docs/editor/stage/`.
- `sidebars.js` lists every page explicitly, in five sidebars: `using`,
  `extensions`, `packager`, `contributing`, `backend`. A page that is not
  listed there does not appear in navigation, so add new pages to it.
- Each section starts with an overview page that links into it.
- `src/theme/SearchBar/` is the search UI, `src/pages/index.js` the landing page.

## Embedded in the editor

`scratch-gui/src/components/mw-help-modal/help-modal.jsx` sets
`localStorage.theme`, `data-theme` and the editor's CSS custom properties on
the iframe's `<html>`. `src/css/custom.css` maps Infima variables onto those
(`--ui-modal-background`, `--text-primary`, `--looks-secondary`, ...), with
standalone fallbacks. `html[data-embedded]` hides the colour mode switch, and
`src/clientModules/spotlight-key.js` hands Ctrl or Cmd+K to the editor.

## URL contract

The editor and other sites deep-link into the docs. Never remove or rename a
page without adding its old path to `redirects.js`.
`scripts/check-inbound-links.mjs` checks every path in
`scripts/inbound-links.json` and every docs link in a sibling `scratch-gui`
checkout against the build. Run `npm run check -- --write` to add new
scratch-gui links to the committed list.

## Writing

- Plain, direct, second person. Sentence case titles and headings, one
  heading per section with no eyebrow label above it, no ALL CAPS headings.
- No em dashes anywhere. Use commas, parentheses or "to".
- No code comments.
- Link to other pages with root paths such as `/advanced/cloud-variables`.
  Broken links and anchors fail the build.
- Admonitions are tinted backgrounds with an icon. Never add a left border or
  stripe to anything with rounded corners.
- READMEs are short overviews, never documentation.

## Commands

- `npm run build` builds the site and the search index.
- `npm run check` checks inbound links. Run it after a build.
