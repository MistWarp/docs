---
title: Packaging a project
sidebar_position: 24
---

The **packager** turns a project into a standalone application: an HTML file, a zip, or a native app for Windows, macOS, or Linux that runs without the editor. It is built into the editor and opens in an editor window.

## Opening the packager

**File, Export, Package project** (`Ctrl+P`, or `Cmd+P` on macOS) opens the [MistWarp packager](/packager/overview) as an editor window. The options appear immediately. Each Package or Preview action includes the latest project changes, even edits made while the window is open.

The window follows the editor theme. Its settings are grouped into Export, Runtime, Appearance, and Advanced tabs.

## What packaging is for

Packaging is how you distribute a finished project outside the MistWarp site:

- A single **HTML file** you can host anywhere or open offline.
- A **zip** with the HTML and its assets.
- Native **executables** for desktop platforms.

The packaged output embeds MistWarp's runtime and compiler, so packaged projects run at full speed with your chosen [settings](/editor/settings) baked in. You can customise the loading screen, controls, cloud-variable behaviour, and more in the packager itself.

## Sharing versus packaging

These are different things:

- **Sharing** a project (from its [project page](/editor/project-management)) publishes it on the community site, where people play it in the browser player.
- **Packaging** produces a file you own and distribute yourself, with no dependency on the MistWarp site.

## See also

- [Packager overview](/packager/overview) for the full list of options
- [Embedding](/packager/embedding) and [commercial use](/packager/commercial-use)
- [Offline support](/packager/offline)
- [Project management](/editor/project-management)
