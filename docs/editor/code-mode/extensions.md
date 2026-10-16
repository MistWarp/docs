---
title: Extensions in Code mode
sidebar_position: 3
---

The **Extensions** folder of the explorer lists every extension in the project as a `.js` file. Open one to read and edit its code in a tab with JavaScript completion for the `Scratch` API and `getInfo`. Built-in extensions are listed without source.

How to write an extension, step by step, is in [writing extensions in the editor](/building-extensions/in-editor). This page covers how extensions behave in the workbench.

## Adding extensions

- Right-click **Extensions** and choose **New extension** to create one. The form opens as a tab.
- **Add extension** opens the extension library.
- Drag a `.js` file from your computer onto **Extensions**. It always loads sandboxed. To run it without the sandbox, choose **Run unsandboxed** from the tab's **More actions** menu; a prompt shows the file name and the start of its code before you allow it.

**Project**, **Show Extensions in Code Mode** (`Ctrl+Shift+E`) switches to Code mode and opens the folder.

## Applying an extension

Press `Ctrl+Enter` or click **Apply** in the extension tab. An extension apply is checked like a script apply:

- a syntax error blocks the apply
- if the new code fails to load or `getInfo` throws, the previous version keeps running and the error is listed in **Problems**
- if the new code removes a block the project uses, or renames or reorders its inputs, a dialog lists the blocks and sprites affected before anything changes

**Apply as I type** applies on its own when the code has no errors. Every applied version goes into code change history, so **Edit**, **Undo code change** brings back the previous code.

## Problems and output

Problems lists load errors, warnings and errors thrown by the extension's blocks while the project runs. An error thrown by a block shows both the extension line and the calling line in `scripts.fractch`; click either to open it.

Output records each apply and reload, the extension's `console` messages, and runtime errors with their time.

To step through extension code, put a `debugger;` statement where you want to stop, open your browser's developer tools, and run the block.

## Other actions

The **More actions** menu of an extension tab has **Reload**, **Convert to embedded** (for extensions loaded from a URL), **Download .js**, **Run unsandboxed**, **Extension docs** and **Remove from project...**. Drag an extension row in the explorer to reorder the palette.

Extension code, new extensions, drops and removal are locked during a [collaboration](/editor/collaboration) session. Loading and reordering extensions still works.

## See also

- [Writing extensions in the editor](/building-extensions/in-editor)
- [Applying code](/editor/code-mode/applying)
