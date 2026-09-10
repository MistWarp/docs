---
title: Settings
sidebar_position: 16
---

The **Settings** button in the [menu bar](/editor/menu-bar) opens the settings window. It controls how the editor looks and how your projects run. Settings are organised into a sidebar of pages, grouped into General, Appearance, Tools, and Advanced. Every row has a **?** button that reveals a short explanation, and many link out to fuller documentation.

## General

**General** holds the settings most people reach for, under three headers:

- **Featured**:
  - **60 FPS** runs scripts 60 times a second instead of 30. An inline link lets you pick any [custom framerate](/advanced/custom-fps).
  - **Interpolation** smooths sprite motion between frames. See [interpolation](/advanced/interpolation).
  - **High Quality Pen** renders pen at higher resolution. See [high quality pen](/advanced/high-quality-pen).
  - **Warp Timer** stops long or infinite loops from freezing the project. See [warp timer](/advanced/warp-timer).
- **Remove Limits**: **Infinite Clones**, **Remove Fencing**, and **Remove Miscellaneous Limits** lift Scratch's built-in caps. See [removing limits](/advanced/remove-limits), [infinite clones](/advanced/infinite-clones), and [remove fencing](/advanced/remove-fencing).
- **Danger Zone**: set a [custom stage size](/advanced/custom-stage-size), and **Store settings in project** so your chosen options (and optionally your theme) are re-applied whenever the project loads.

**Language** sets the editor's language. **Keyboard Shortcuts** opens the rebindable [shortcut manager](/editor/shortcuts).

## Appearance

Open **Theme** in the sidebar, then choose a tab:

- **Appearance** controls tabs, window chrome, and menu bar layout and visibility.
- **Blocks** chooses block colours. See [themes](/editor/themes).
- **Wallpaper** sets the editor background image, opacity, darkness, and grid.
- **Fonts** chooses the editor font.
- **Editor** groups stage controls, overlays, sound, screenshots, the block palette, and interface controls into tabs.
- **Loading screen** customises the project loading screen.

## Tools

- **Version Control** sets your commit author name and email, the default branch name, and whether to commit automatically on save. See [git](/editor/git).
- **Variable Manager** configures the [variable manager](/editor/variable-manager): default view, live updates, and display limits.
- **Debugger** holds the [debugger](/editor/debugger) toggles: highlight running blocks, and various logging options.
- **Autosave** configures automatic restore points and their frequency. See [restore points](/editor/restore-points).

On the desktop app a **Desktop** page adds app-level options (update channel, microphone and camera, hardware acceleration, and more).

## Advanced

The **Experimental** page holds settings that are still being tested:

- **Real Layer Indexes** changes how sprite layer order is stored, removing the limit on the number of layers.
- **Case Sensitive Lists** makes list values case-sensitive, which can speed up list-heavy projects at the cost of vanilla compatibility. See [variables and lists](/editor/variables).

Some runtime behaviour is also covered on dedicated pages: [disabling the compiler](/advanced/disable-compiler) and [cloud variables](/advanced/cloud-variables).

## Storing settings in a project

Most of these settings apply to the editor for everyone. To make a project always open with specific options (for example a custom stage size or 60 FPS), use **Store settings in project** on the General page. The chosen options, and optionally the theme, are saved into the project and re-applied when it loads.

## See also

- [Themes](/editor/themes) and [addons](/editor/addons)
- [Custom FPS](/advanced/custom-fps), [custom stage size](/advanced/custom-stage-size), [removing limits](/advanced/remove-limits)
- [The menu bar](/editor/menu-bar)
