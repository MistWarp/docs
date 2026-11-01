---
title: The editor interface
sidebar_label: Overview
description: A map of the MistWarp editor window, with a link to the page for every region and tool.
---

# The editor interface

The MistWarp editor is where you build projects. It runs in your browser and in the desktop app, and it ships from the same build as the community site. This page is a map of the editor window: what each region is and where to read more.

## Layout at a glance

The editor is divided into a few fixed regions:

- **Menu bar** across the top: the MistWarp logo (a link back to the home page), the File, Edit, Tools and Bookmarks menus, Settings, the project title, and, on the right, your save status and account. See [the menu bar](/editor/menu-bar).
- **Stage** on one side: the running project, the green flag and stop button, the stage size controls, and the fullscreen button. See [the stage](/editor/stage).
- **Sprite pane** below the stage: the list of sprites, the selected sprite's properties (position, size, direction, visibility), and the stage and backdrop selector. See [sprites](/editor/sprites).
- **Editing area** filling the rest of the window, controlled by three tabs at the top left:
  - **Scripts**: the [blocks palette](/editor/blocks-palette) and the [block workspace](/editor/workspace).
  - **Costumes** (or **Backdrops** when the stage is selected): the [paint editor](/editor/costumes).
  - **Sounds**: the [sound editor](/editor/sounds).

The three tabs switch what the editing area shows for the selected sprite or the stage. The stage, sprite pane and menu bar stay put while you switch tabs.

The **Blocks** and **Code** buttons in the menu bar switch the editing area between these tabs and the [Code mode](/editor/code-mode/overview) workbench, where the project is a tree of text files.

## Editor mode and player mode

The same page can render two ways. In **editor mode** you see everything above. In **player mode** only the stage and its controls are shown, which is what visitors see on a shared project page or an embed. The community project page loads projects into the player rather than the full editor.

## Where to read more

### Building scripts

- [Blocks palette](/editor/blocks-palette) lists every block by category, with extensions below. [Blocks](/blocks/overview) documents what each category does.
- [Workspace](/editor/workspace) is where you snap blocks together, add comments and clean up.
- [Variables and lists](/editor/variables) covers creating variables and their monitors. The [variable manager](/editor/variable-manager) edits many at once.
- [My Blocks](/blocks/my-blocks) explains how to define your own blocks.
- [Find bar](/editor/find-bar) and [workspace bookmarks](/editor/bookmarks) help you move around a large project.

### Sprites, costumes and sounds

- [Stage](/editor/stage) and [sprites](/editor/sprites) cover the right-hand side of the editor.
- [Costumes](/editor/costumes) and [sounds](/editor/sounds) cover the paint and sound editors.
- [Backpack](/editor/backpack) reuses sprites, costumes, sounds and scripts across projects.

### Saving and sharing

- [Project management](/editor/project-management) covers new, save, load and share.
- [Restore points](/editor/restore-points) are autosaves and manual snapshots.
- [Version history](/editor/git) is built-in git for your project.
- [Live collaboration](/editor/collaboration) lets several people work on one project.
- [Packager](/packager/overview) turns a project into a standalone page or app.

### Tools and preferences

- [Settings](/editor/settings), [addons](/editor/addons) and [themes](/editor/themes) change how the editor looks and behaves.
- [Debugger](/editor/debugger) steps through a running project.
- [Keyboard shortcuts](/editor/shortcuts) lists every shortcut and how to rebind them.
- [Compiler and JavaScript](/advanced/javascript), [custom FPS](/advanced/custom-fps) and [custom stage size](/advanced/custom-stage-size) cover the runtime options MistWarp adds.
