---
title: Contribution Guidelines
sidebar_position: 5
---

# Contributing

This page covers the practical workflow for getting a change into MistWarp: where the code lives, how the packages link together while you work, the style rules, and how to open a pull request. If you have not set up a local build yet, read [Building and Running](/contributing/building-running) first.

## Where the code lives

MistWarp is spread across several repositories under the [MistWarp organization on GitHub](https://github.com/MistWarp). The ones you are most likely to touch:

- [scratch-gui](https://github.com/MistWarp/scratch-gui) is the editor and the community site. Most UI work happens here.
- [scratch-vm](https://github.com/MistWarp/scratch-vm) runs projects and holds the block definitions and the compiler.
- [scratch-blocks](https://github.com/MistWarp/scratch-blocks), [scratch-render](https://github.com/MistWarp/scratch-render), [scratch-paint](https://github.com/MistWarp/scratch-paint), and [scratch-audio](https://github.com/MistWarp/scratch-audio) are the other engine packages.

See [Project Structure](/contributing/project-structure) for what each package does.

MistWarp is a fork of TurboWarp, which is a fork of [Scratch](https://scratch.mit.edu/). Because of that lineage, a lot of the code you read (and a lot of the fixes you make) are not MistWarp-specific. Bugs that also exist in upstream are often best reported or fixed upstream too.

## Working across packages

scratch-gui pins each engine fork (scratch-vm, scratch-blocks, scratch-render, scratch-paint, scratch-audio) to a commit in `package.json`, so it builds on its own. To test a change to a fork inside the editor, clone the fork next to scratch-gui and link it:

```bash
pnpm run link     # symlinks every fork checked out next to scratch-gui
pnpm run unlink   # goes back to the pinned copies
```

`pnpm run link` only touches `node_modules`, never `package.json`, so there is nothing to undo before committing. Do not use `pnpm link` directly: it writes a `link:` override into `package.json`, and CI rejects it.

A fork change reaches scratch-gui in two steps: merge it into the fork's `develop`, then move scratch-gui's pin with `pnpm run deps:sync` (production deploys do this automatically). If your change spans a fork and scratch-gui, open both pull requests and link them to each other.

## Style rules

Some rules are enforced by the linter, and some are project conventions you have to follow by hand.

Run the linter before you commit:

```bash
pnpm run lint   # eslint check
pnpm run fmt    # eslint --fix
```

Two conventions the linter does not catch, but which are hard project rules across every repository:

- **No code comments.** Do not add explanatory comments to code. The only comments allowed are lint-required markers such as `eslint-disable` lines. This applies to every MistWarp repository.
- **No emdashes.** Do not use emdashes anywhere: not in code, not in UI strings, not in prose. Use commas, parentheses, or "to" for ranges.

A few package-specific rules that are easy to trip over:

- scratch-gui CSS goes through PostCSS with postcss-import, postcss-simple-vars, and autoprefixer. There is no `lighten()` or `darken()`; use `color-mix()` instead.
- Vite treats every `.css` file imported in scratch-gui as a CSS module, even without a `.module.css` name, so class names are hashed and exposed in camelCase. Wrap a selector in `:global(...)` to target a class you do not own, or import the file with `?inline` to get its text as a string and inject it yourself.
- The editor theme sets bare custom properties such as `--ui-primary` and `--text-primary` on the document element. Community styles use the tokens in `src/community/styles/tokens.module.css` and must not redefine an editor property name (the community text color is `--mw-text` for this reason). Run `pnpm run check:community-css` after changing community CSS. See [Theming](/internals/theming).
- Editor strings go through react-intl with a single string literal as the `defaultMessage`, and `pnpm run i18n:editor:extract` must be rerun after changing one. Community strings go through `communityText()` and must be whole sentences.
- Edits under scratch-blocks `core/` require a Closure recompile, and any new symbol must be exported in the `goog.global` block or Closure strips it. See [Building and Running](/contributing/building-running).

## Testing your change

Run the relevant test suite before opening a pull request. scratch-gui and scratch-vm have separate suites with separate commands, covered in [Testing](/contributing/testing), which also lists the exact checks scratch-gui's CI runs. At minimum, the changed files must lint cleanly and the app must build.

## Opening a pull request

1. Fork the repository you are changing, or push a branch if you have access. Do not commit directly to the default branch.
2. Make your change on a topic branch with a descriptive name.
3. Run ESLint on the files you changed, run the tests, and make sure the build succeeds.
4. Open a pull request against the corresponding MistWarp repository. The default branch is `develop` for scratch-gui and the engine forks, and `master` for the docs. Describe what the change does and why. If it fixes a bug, describe how to reproduce it.
5. If your change spans multiple packages (for example a VM change that the GUI depends on), note that in the description so reviewers can check out matching branches.
6. scratch-gui pull requests get a Cloudflare Pages preview. Check your change there, and include screenshots in the description when it changes something visible.

## Licensing

MistWarp inherits TurboWarp's and Scratch's licensing. TurboWarp's modifications to Scratch are under the GNU General Public License v3.0, and the original Scratch BSD license is retained where required. By contributing you agree your changes are released under the same terms. The bundled addons come from the [Scratch Addons](https://scratchaddons.com/) project; see [The Addons System](/internals/addons-system).

## See also

- [Building and Running](/contributing/building-running)
- [Project Structure](/contributing/project-structure)
- [Testing](/contributing/testing)
- [Deploying](/contributing/deploying)
- [Internals Overview](/internals/overview)
