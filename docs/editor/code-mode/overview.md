---
title: Code mode
sidebar_position: 1
---

The editor has two modes. **Blocks** mode is the classic editor with the Scripts, Costumes and Sounds tabs. **Code** mode replaces the left side of the editor with a workbench where the whole project is a tree of files: every sprite's scripts as [fractch](https://github.com/Mistium/FRACTCH) text, its costumes and sounds, and the project's extensions as JavaScript. The stage and the sprite pane stay on the right in both modes.

Nothing is lost when you switch. Both modes edit the same project, and scripts you do not touch in Code mode keep their exact blocks.

## Switching modes

Use the **Blocks** and **Code** buttons in the menu bar, or press `Ctrl+Shift+Y` (`⌘+Shift+Y` on macOS). The first time you enter Code mode, the selected sprite's `scripts.fractch` opens.

Some commands switch to Code mode for you: **Project**, **Show Extensions in Code Mode**, **Show in code** on a block, and **Go to definition** on an extension block.

## The explorer

The explorer on the left lists the project as a tree. Toggle it with `Ctrl+B`.

- **Stage** holds `scripts.fractch`, **Backdrops** and **Sounds**.
- Each sprite, in sprite pane order, holds `scripts.fractch`, **Costumes** and **Sounds**.
- **Extensions** holds one `.js` file per extension. Built-in extensions are listed without source.

Rows show a thumbnail for costumes and backdrops, the length of each sound, and a problem count on scripts and extensions.

Right-click a row for its actions:

- the root: **Add sprite** (paint, upload, choose, or surprise)
- a sprite or the Stage: **Rename**, **Duplicate**, **Delete**, **Export**, **Reveal in sprite pane** (the Stage has no rename, duplicate or delete)
- a file: **Open**, **Rename**, **Duplicate**, **Delete**, **Export**
- a folder: new costume, backdrop or sound (paint, record, upload, choose), **New extension** and **Add extension**

With the tree focused, the arrow keys move the selection, `Enter` opens, `F2` renames and `Delete` deletes.

Drag files from your computer onto the tree to add them: images onto a sprite or its Costumes become costumes, audio onto Sounds becomes sounds, a `.sprite3` or an image onto the root adds a sprite, and a `.js` file onto Extensions loads it sandboxed. Drag a costume or sound onto another sprite to copy it, or within its folder to reorder it.

## Editor tabs

Files open as tabs in the middle of the workbench.

- A single click opens a preview tab with an italic title, which the next preview replaces. Double-click a file, or edit it, to keep the tab open.
- A dot on a tab means it has text that is not applied yet.
- Middle-click or the close button closes a tab. Right-click a tab for **Close**, **Close others**, **Next tab** and **Previous tab**.
- **Quick open** (`Ctrl+E`) searches every file in the project.

Scripts open as fractch text, extensions as JavaScript, costumes in the paint editor and sounds in the sound editor. Opening a file of another sprite selects that sprite in the sprite pane, and selecting a sprite reveals it in the explorer.

Each script tab has a strip across the top with one status message on the left and **Apply**, **Run all** and **Stop** on the right. See [applying code](/editor/code-mode/applying) and [running and debugging](/editor/code-mode/debugging).

## The panel

The panel along the bottom has four tabs. Toggle it with `Ctrl+J`.

- **Problems** lists errors and warnings for every file, grouped by file. Click an entry to jump to its line.
- **Output** records extension console messages, applies, reloads and runtime errors.
- **Reference** is a searchable list of blocks. Click one to insert it at the cursor.
- **Watch** shows pinned variables and, while the project is paused, where it stopped and the script's local values.

## Writing scripts

The text editor knows the fractch language and the project:

- completion for blocks, variables, lists, custom blocks, broadcasts and extension blocks, with their argument names
- hover for what a block does, and for a variable's live value
- **Go to definition** (`F12`) and **Find references** (`Shift+F12`) for custom blocks, variables, broadcasts and extension blocks
- **Rename** (`F2`) for custom blocks, variables and broadcasts

Drop a costume or sound from the explorer into a script to insert its name.

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Switch between Blocks and Code | `Ctrl+Shift+Y` |
| Toggle the explorer | `Ctrl+B` |
| Toggle the panel | `Ctrl+J` |
| Quick open | `Ctrl+E` |
| Apply the file | `Ctrl+Enter`, `Ctrl+S` |
| Apply every file with unapplied text | `Ctrl+Shift+Enter` |
| Show extensions in Code mode | `Ctrl+Shift+E` |
| Go to definition | `F12` |
| Find references | `Shift+F12` |
| Rename | `F2` |
| Close tab, next tab, previous tab | not bound |

`Ctrl+Enter` and `Ctrl+S` apply the open file and `Ctrl+Shift+Enter` applies every script file, but only inside a script or extension tab. Elsewhere they run the green flag, save and stop the project as usual. Every shortcut can be changed in the [shortcut manager](/editor/shortcuts).

## Limits

Costume, sound and sprite properties are not text, the editor shows one file at a time, and onion skinning, folders, hide flyout and compact editor are only available in Blocks mode.

## See also

- [Applying code](/editor/code-mode/applying)
- [Extensions in Code mode](/editor/code-mode/extensions)
- [Running and debugging](/editor/code-mode/debugging)
