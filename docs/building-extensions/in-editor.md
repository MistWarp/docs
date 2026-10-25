---
title: Writing extensions in the editor
sidebar_position: 1.5
---

You can write, test, and fix an extension without leaving MistWarp. Extensions are files in [Code mode](/editor/code-mode/extensions), and their code is saved inside the project, so it travels with it.

## Create an extension

1. Open **Project** in the menu bar and choose **New Extension**, or right-click **Extensions** in the Code mode explorer and choose **New extension**.
2. Type a name. The ID is made from it; it can only contain letters and numbers, and blocks are saved with it, so choose it once.
3. Pick **Blank** for a sandboxed extension with one reporter, or **Unsandboxed** for one that can reach the project, the stage, and the editor.
4. Click **Create**. The extension loads, its category appears in the block palette, and its code opens as a tab in Code mode.

You can also paste code into **Add Extension**, **Custom Extension**, **Text**, and click **Open in editor** instead of **Load**.

## Edit and apply

The editor has completion for the `Scratch` API and for `getInfo` (block types, argument types, and every block field), with a short description of each item. Hover over a `Scratch.` member to read it again.

- **Apply** (or Ctrl+Enter, or Ctrl+S) runs your code in the project. Scripts that are already running keep going and use the new code from their next block.
- If the new code fails to load, it is not applied. The previous version keeps running and the **Problems** tab shows why, with the line and column.
- If the new code removes a block the project uses, or changes its inputs, a dialog lists the affected blocks and sprites first.
- **Edit**, **Undo** (shown as **Undo change to** and the extension's name) brings back the previous version.

Extensions that came with a project open read-only. Click **Edit** to change one.

## Problems and output

The Code mode panel (Ctrl+J) has a **Problems** tab that lists, for each extension:

- syntax errors and errors thrown while the file loads, with their line
- best-practice warnings, such as code outside an IIFE or unsandboxed APIs used without the unsandboxed check. Many come with a fix button.
- errors thrown by its blocks and menus while the project runs. **Show block** jumps to the block, which is outlined in red in the workspace.

Right-click an extension block and choose **Go to definition** to open its code, or **Show problem** when it caused an error.

Suppress a warning for one line with a comment above it:

```js
// mw-ext-disable-next-line raw-fetch
const response = await fetch(url);
```

To turn a check off for the whole file, put `// mw-ext-disable` and the check names anywhere in it, for example `// mw-ext-disable no-register` in a helper file that never registers an extension. Leave out the names to turn every check off.

The **Output** tab records applies, reloads, the extension's `console` messages, and errors with their time.

To step through extension code, add a `debugger;` statement, open your browser's developer tools, and run the block.

## Manage extensions

Every extension in the project is listed under **Extensions** in the Code mode explorer. **Project**, **Show Extensions in Code Mode** (Ctrl+Shift+E) opens it. The **More actions** menu of an extension tab can:

- **Reload** it from its source
- **Convert to embedded**, which copies the code of a URL extension into the project so you can edit it
- **Download .js**
- **Run unsandboxed**, for an extension you dropped in from a file
- **Remove from project...**, which shows each sprite that uses its blocks and what happens to them before anything is deleted

Drag an extension row in the explorer to move it up or down in the palette.

The same actions are in the right-click menu of the extension's category in the block palette.

## Limits

Applying replaces the extension's object, so state kept on it starts fresh. Some changes cannot be undone in place: event listeners added to the editor, wrapped `vm` methods, and other patches to MistWarp itself. When a file does this, its tab says **This file changes the editor itself. Reload the page to apply every change.** Save the project and reload the page.

Extension editing is unavailable during a collaboration session.
