---
title: Editor integration
sidebar_position: 7
---

# Editor integration

Choose **File, Export, Package project** to package the project open in the editor. The packager opens in a resizable editor window and follows the editor's theme.

## Current project

The options open immediately. Each Package or Preview action takes a fresh snapshot of the current project, including unsaved changes. You can continue editing while the packager is open.

The Export tab selects the output format. Runtime, Appearance, and Advanced contain the remaining settings. Package and Preview remain available at the bottom of the window on every tab.

Closing the packager cancels work in progress. Packaging options are saved for the project.

## GUI integration

The React window is maintained in the GUI repository under `src/containers/packager.jsx`, with its options in `src/components/packager` and export engine in `src/packager`. It uses the editor's window components, theme, and brand constants. Project data comes from the active VM through `vm.saveProjectSb3('arraybuffer')` when an export starts.

The old cross-origin `p4` message handshake is no longer used by the editor. GUI builds include the packager UI and the player scripts needed to generate exports. Desktop runtime archives are downloaded when needed.

## See also

- [Packager overview](/packager/overview)
