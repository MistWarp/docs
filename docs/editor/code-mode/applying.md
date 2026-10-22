---
title: Applying code
sidebar_position: 2
---

Typing in a script tab never changes the project on its own. Your text reaches the project when you **apply** it, and only if it parses, validates and converts back to the same blocks. Scripts you did not edit keep their exact blocks and block ids, and every apply can be undone.

## Apply a file

- Press `Ctrl+Enter` (`⌘+Enter` on macOS) or click **Apply** in the strip above the text.
- Press `Ctrl+S` in a script tab to apply the file without saving the project.
- Text is applied only when you ask for it. Nothing is applied while you type.

A dot on the tab and in the explorer marks text that is not applied yet. Saving the project always saves the applied project, never unapplied text. Leaving the page or loading another project with unapplied text asks first.

## What happens when you apply

1. The text is parsed. Any syntax error stops the apply, and the errors are listed in **Problems** with their line.
2. The scripts are built and checked: every block must exist, inputs and menus must be valid, custom block calls must match their definitions, and nothing may use a variable you deleted.
3. The result is turned back into text and built again. If that does not give the same blocks, the apply is refused with the first line that differs.
4. If the change removes a whole script, more than 20 blocks, a standard library import, a variable that holds a value, a cloud variable, or a Stage variable other sprites use, a dialog lists what would be removed. Nothing changes until you click **Apply**.
5. The first apply after a project loads makes a [restore point](/editor/restore-points). If the backup fails, you are asked before anything is applied.
6. Only the changed scripts are replaced. Threads running a changed script stop; the rest of the project keeps running. Variables keep their current values unless you edited their declaration.

If the project changes while an apply is running, for example because a script moved in Blocks mode, the apply is refused with **The project changed while applying, try again**.

After an apply the text is rewritten in its canonical form, unless you kept typing during the apply. Then only the parts you did not touch are updated.

## Locked scripts

A few scripts cannot be shown as text and converted back exactly, for example ones using a block fractch cannot represent the same way. These scripts are **locked**: a lock icon sits in the gutter, their lines are read-only, and hovering the icon shows the reason and a **Show block** button. The strip says how many scripts are locked.

Locked scripts are always kept exactly as they are. You can type around them and delete a whole locked script, but to change one, edit it in Blocks mode.

## Conflicts

If blocks change while a tab has unapplied text, for example in Blocks mode or through [fractch live reload](#fractch-live-reload), the text is merged script by script. Scripts you did not edit take the new version; scripts you edited keep yours. When the same script changed on both sides, the strip shows a conflict and **Resolve** opens each script side by side so you can keep your text or use the block version. Apply is disabled until every conflict is resolved.

## Undo and redo

- Inside a script tab, `Ctrl+Z` and `Ctrl+Shift+Z` undo and redo typing.
- **Edit**, **Undo code change** and **Redo code change** undo and redo whole applies. With the explorer or panel focused, `Ctrl+Z` undoes the most recent apply or deletion.
- An apply can only be undone while the scripts it changed are still as it left them. If blocks changed since, a dialog explains why and offers **Show changes** and **Open restore points**.

Code change history is cleared when a project loads.

## Unapplied text between sessions

Unapplied text is kept as a draft for projects saved to MistWarp or to a file on the desktop app. When you open the project again, a draft whose scripts have not changed since comes back as unapplied text with **Restored unapplied changes**. If the scripts changed in the meantime, the draft opens read-only as **Unapplied changes from an earlier session** with **Copy** and **Discard**.

## Collaboration

During a [live collaboration](/editor/collaboration) session script text and extension code are read-only, and code changes cannot be applied or undone. The strip says **Editing code is unavailable during collaboration**. Costumes, sounds, sprites and loading extensions still work. Unapplied text is kept as a draft when a session starts.

## fractch live reload

`fractch run <folder>` serves a fractch project from your computer and opens it in the editor with live reload. When you save a `.fractch` file, the change is applied to the open project like an apply from Code mode:

- it goes through the same checks, makes a restore point before the first change, and adds an entry per sprite to code change history, so **Undo code change** reverts it
- scripts you edited in the editor since the last reload are kept, and a script changed both in the file and in the editor opens in Code mode as a conflict for you to resolve
- a change that adds, removes or renames sprites, or changes costumes, sounds, extensions or monitors, asks before reloading the whole project
- errors are listed in **Problems**
- it pauses during collaboration

Live reload only connects to addresses on your own computer (`localhost`, `127.0.0.1` or `[::1]`).

## See also

- [Code mode](/editor/code-mode/overview)
- [Restore points](/editor/restore-points)
