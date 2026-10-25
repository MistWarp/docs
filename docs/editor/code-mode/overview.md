---
title: Code mode
sidebar_position: 1
---

The editor has two modes. **Blocks** mode is the classic editor with the Scripts, Costumes and Sounds tabs. **Code** mode replaces the left side of the editor with a workbench where the whole project is a tree of files: every sprite's scripts as [fractch](https://github.com/Mistium/FRACTCH) text, its costumes and sounds, and the project's extensions as JavaScript. In Code mode the stage floats over the workbench instead of sitting in a panel on the right, so the code gets the full width.

Nothing is lost when you switch. Both modes edit the same project, and scripts you do not touch in Code mode keep their exact blocks.

## Switching modes

Use the **Blocks** and **Code** buttons in the menu bar, or press `Ctrl+Shift+Y` (`⌘+Shift+Y` on macOS). The first time you enter Code mode, the selected sprite's `scripts.fractch` opens.

Some commands switch to Code mode for you: **Project**, **Show Extensions in Code Mode**, **Show in code** on a block, and **Go to definition** on an extension block.

## The explorer

The explorer on the left lists the project as a tree. Toggle it with `Ctrl+B`.

- **Stage** holds `scripts.fractch`, any other fractch files, **Backdrops** and **Sounds**.
- Each sprite, in sprite pane order, holds `scripts.fractch`, any other fractch files, **Costumes** and **Sounds**.
- **Extensions** holds one `.js` file per extension. Built-in extensions are listed without source.

Rows show the current costume of each sprite and the current backdrop of the Stage, a thumbnail for costumes and backdrops, the length of each sound, and a problem count on scripts and extensions.

Right-click a row for its actions:

- the root: **Add sprite** (paint, upload, choose, or surprise)
- a sprite or the Stage: **New file**, **Rename**, **Duplicate**, **Delete**, **Export** (the Stage has only **New file**). On narrow screens, where the sprite pane is shown, there is also **Reveal in sprite pane**.
- `scripts.fractch`: **Open**, **New file**, **Export**
- another fractch file: **Open**, **New file**, **Rename**, **Delete**, **Export**
- a costume or sound: **Open**, **Rename**, **Duplicate**, **Delete**, **Export**
- a folder: new costume, backdrop or sound (paint, record, upload, choose), **New extension** and **Add extension**, or **New file** in a folder of fractch files

With the tree focused, the arrow keys move the selection, `Enter` opens, `F2` renames and `Delete` deletes.

Drag files from your computer onto the tree to add them: images onto a sprite or its Costumes become costumes, audio onto Sounds becomes sounds, a `.sprite3` or an image onto the root adds a sprite, and a `.js` file onto Extensions loads it sandboxed. Drag a costume or sound onto another sprite to copy it, or within its folder to reorder it. Drag a sprite onto another sprite to reorder the sprites.

### Several files in one sprite

A sprite can split its scripts across several fractch files. `scripts.fractch` is always listed first, then the other files in alphabetical order, with folders shown as folders.

- **New file** asks for a name and opens the new, empty file. Use a slash to put it in a folder, for example `enemies/boss`. Names cannot be empty, start with a dot, end with a dot, contain control characters or any of `< > : " | ? *`, or be `main`, `index` or a name Windows reserves such as `con`, `nul`, `com1` or `lpt1`. Each name can be used once per sprite, ignoring case, and a folder keeps the capitalisation it already has.
- **Rename** changes the file name in place. The tab of an open file follows the new name.
- **Delete** removes the file and everything in it from the text. A file with any text in it asks first, and **Undo** in the strip above the text brings the file back until you type again. Apply to remove its scripts from the project. A file with scripts that cannot be shown as text cannot be deleted here.
- To move a script to another file, cut it from one file and paste it into the other, then apply.

Variables, lists, cloud variables, monitors, imports, costumes and sprite settings always stay in `scripts.fractch`. Only whole scripts go in the other files.

A comment is saved with the script below it. A comment with no script below it, such as a note at the end of a file or in a file with no scripts, moves to `scripts.fractch` when you apply. A file with no scripts stays in the explorer after you apply, but it is not saved with the project, so it is gone after the project is reloaded.

In the text, each file is a `region "name" { ... }` block. Only a header line that is exactly `region "name" {` and a closing line that is exactly `}`, both starting at the beginning of the line, make a file. A block with anything else on those lines, such as `region "a" { // enemies` or `} // end`, stays in `scripts.fractch` as text, and so does a block inside a comment or a `"""` string, a block whose name cannot be a file name, and a second block with the name of an existing file.

A block you type in `scripts.fractch` becomes a file once the cursor leaves it with nothing selected, you switch tabs or you apply. Undo in `scripts.fractch` does not reach back past that point. To undo making the file, delete it, then use **Undo** in the strip if you want it back.

All the files of a sprite are applied together, so **Apply** in any of them applies the whole sprite. Each tab shows a dot only when its own file has unapplied text, the sprite shows a dot in the explorer when any of its files does, and a tab whose own text is unchanged says when another file of the sprite will be applied with it. Problems are listed per file with line numbers in that file.

When the project is committed or saved as a `.mwp`, each file becomes its own `.fractch` file in the sprite's folder, for example `Sprite1/enemies/boss.fractch`, and loading the project lists the files again.

Clicking a sprite or the Stage makes it the current sprite, the same as clicking it in the sprite pane in Blocks mode.

**Properties**, under the tree, edits the selected sprite: its name, x and y, size, direction and rotation style, and whether it is shown. Click the heading to collapse it. It is hidden while the Stage is selected.

## The stage

The stage floats over the workbench in a window with the green flag, pause and stop on its title bar, along with the variable manager, screenshot, full screen and **Hide stage**.

- Drag the grip at the left of the title bar, or any empty part of it, to move the stage. When you let go it settles against the nearest corner and keeps that distance when the editor is resized. Dropping it close to an edge snaps it to the corner.
- Drag the small handle on the corner facing away from the screen edge to resize it. The stage keeps its proportions.
- **Hide stage** shrinks the window to its title bar, so the controls stay available. **Show stage** brings it back.
- With the grip focused, the arrow keys move the stage to another corner. With the resize handle focused, the arrow keys make it larger or smaller.

The position, size and hidden state are remembered between sessions. On narrow screens Code mode keeps the stage and sprite pane in their own views, the same as Blocks mode.

## Editor tabs

Files open as tabs in the middle of the workbench.

- A single click opens a preview tab with an italic title, which the next preview replaces. Double-click a file, or edit it, to keep the tab open.
- A dot on a tab means it has text that is not applied yet.
- Middle-click or the close button closes a tab. Right-click a tab for **Close**, **Close others**, **Next tab** and **Previous tab**.
- **Quick open** (`Ctrl+E`) searches every file in the project.

Scripts open as fractch text, extensions as JavaScript, costumes in the paint editor and sounds in the sound editor. Opening a file of another sprite selects that sprite, and selecting a sprite reveals it in the explorer.

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

Costume, sound and sprite properties are not text (sprite properties are edited in **Properties**), each editor tab shows one file, and onion skinning, folders, sprite search, the surprise backdrop button, hide flyout and compact editor are only available in Blocks mode.

## See also

- [Applying code](/editor/code-mode/applying)
- [Extensions in Code mode](/editor/code-mode/extensions)
- [Running and debugging](/editor/code-mode/debugging)
