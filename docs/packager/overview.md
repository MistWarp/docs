---
title: The MistWarp packager
sidebar_label: Overview
description: Turn a project into a single HTML file, a zip, or a desktop app that runs without the editor.
---

# The MistWarp packager

The packager turns a Scratch or MistWarp project into a standalone program: a single HTML file, a zip, or a native app for Windows, macOS or Linux. The output does not need the editor or an internet connection to run, and it bundles MistWarp's compiled runtime, so packaged projects run at full speed.

It fills the same role as HTMLifier or the forkphorus packager, with more output formats and more control over the loading screen, controls and runtime settings.

## Opening the packager

Open your project in the editor, then choose **File, Export, Package project** (`Ctrl+P`, or `Cmd+P` on macOS). The packager opens as an editor window that follows the editor theme, with its settings grouped into Export, Runtime, Appearance and Advanced tabs.

Each Package or Preview action reads the current project, including unsaved changes and edits made while the window is open. For a project on your computer, load its `.sb3` in the editor first. See [editor integration](/packager/editor-integration).

## What you can do with it

- **Share a project as one file.** Send someone an HTML file they can open in any browser, with no MistWarp branding around it.
- **Ship a desktop app.** Package to an Electron, NW.js or WKWebView executable that runs like a native program.
- **Embed a project you fully control.** [Embed the packaged file](/packager/embedding) instead of relying on a hosted embed.
- **Run offline or on locked-down networks.** See the [offline packager](/packager/offline).

## Sharing and packaging are different

- **Sharing** a project (see [project management](/editor/project-management)) publishes it on the community site, where people play it in the browser player.
- **Packaging** produces a file you own and distribute yourself, with no dependency on the MistWarp site.

## Common settings

The packager exposes most of the same runtime options as the editor, including [custom FPS](/advanced/custom-fps), [interpolation](/advanced/interpolation), [high quality pen](/advanced/high-quality-pen) and [custom stage size](/advanced/custom-stage-size). It also adds packager-only features:

- [Dynamic stage resize](/packager/dynamic-stage-resize) makes the stage follow the window or fullscreen size.
- [Special cloud behaviors](/packager/special-cloud-behaviors) give cloud variables with special names extra powers.

## In this section

- [Embedding packaged projects](/packager/embedding)
- [Can I sell packaged projects?](/packager/commercial-use)
- [Dynamic stage resize](/packager/dynamic-stage-resize)
- [Special cloud behaviors](/packager/special-cloud-behaviors)
- [Offline packager](/packager/offline)
- [Editor integration](/packager/editor-integration)
