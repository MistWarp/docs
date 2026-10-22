---
title: Running and debugging
sidebar_position: 4
---

You can run, stop and debug scripts without leaving Code mode.

## Run and stop

- Click the play icon in the gutter next to a script's first line to run that script, like clicking a stack in Blocks mode.
- **Run all** in the strip above the text starts the file's green flag scripts.
- **Stop** stops every script of that sprite.

While a script runs, its first line is marked in the gutter.

## Runtime errors

When a script or an extension block throws while the project runs, the error appears in **Problems** and **Output** at the line of the script that caused it. Errors from an extension also show the line in the extension file. A script's errors clear when you apply its file or the script starts again.

## Breakpoints

Click the breakpoint gutter beside a line to toggle a breakpoint on the block that starts there. Apply your changes first; breakpoints cannot be added to unapplied text.

When a script reaches a breakpoint the project pauses, the line is highlighted, and the **Watch** tab shows where it stopped with the script's inputs and local variables. **Continue** resumes the project and **Step** runs the next block.

Scripts with breakpoints run without the compiler, so they stop on the exact block. A script that uses blocks only the compiler can run, such as the JSON list blocks, keeps running compiled. It stops between frames instead of on the exact block, **Step** is unavailable, and the Watch tab says so.

A script that was already running compiled when you added the breakpoint also stops between frames. Restart it to stop on the exact block.

## Watching values

Hover a variable or list in a script to see its current value. Click **Pin to Watch** to keep it in the **Watch** tab, where values update while the project runs.

## The debugger window

The [debugger](/editor/debugger) window shows the log, threads and performance, and works in both modes.

## See also

- [Code mode](/editor/code-mode/overview)
- [Extensions in Code mode](/editor/code-mode/extensions)
