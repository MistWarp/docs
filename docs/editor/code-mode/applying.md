---
title: Applying code
sidebar_position: 2
---

Typing in a script tab never changes the project on its own. Your text reaches the project when you **apply** it, and only if it parses, validates and converts back to the same blocks. Scripts you did not edit keep their exact blocks and block ids, and every apply can be undone.

## Apply a file

- Press `Ctrl+Enter` (`⌘+Enter` on macOS) or click **Apply** in the strip above the text.
- Press `Ctrl+S` in a script tab to apply the file without saving the project.
- Text is applied only when you ask for it. Nothing is applied while you type.

## Apply every file at once

When more than one script file has unapplied text, **Apply all** appears next to **Apply** in the strip. Click it, press `Ctrl+Shift+Enter` (`⌘+Shift+Enter` on macOS) in a script or extension tab, or choose **Edit**, **Apply all code changes**.

Apply all checks every file first. If any file has an error, nothing is applied, the errors are listed in **Problems**, and the other files say which files need fixing. Otherwise the files are applied as one change:

1. The Stage, with its new variables and scripts. Variables you removed from the Stage stay for now.
2. Each sprite, in the order of the sprite list. Sprites see the Stage's new variables, so a name the Stage now declares refers to the Stage variable.
3. The Stage variables you removed are deleted last. If a sprite still uses one, nothing is applied.

If anything removes scripts or variables, one dialog lists the changes for every file. If a file fails partway, every file already applied is put back, nothing changes, and the file that failed shows why. One **Undo code change** reverts the whole Apply all.

A dot on the tab and in the explorer marks text that is not applied yet. Saving the project always saves the applied project, never unapplied text. Leaving the page or loading another project with unapplied text asks first.

## What happens when you apply

1. The text is parsed. Any syntax error stops the apply, and the errors are listed in **Problems** with their line.
2. The scripts are built and checked: every block must exist, inputs and menus must be valid, custom block calls must match their definitions, and nothing may use a variable you deleted.
3. The result is turned back into text and built again. If that does not give the same blocks, the apply is refused with the first line that differs.
4. If the change removes a whole script, more than 20 blocks, a standard library import, a variable that holds a value, a cloud variable, or a Stage variable other sprites use, a dialog lists what would be removed. Nothing changes until you click **Apply**.
5. The first apply after a project loads makes a [restore point](/editor/restore-points). If the backup fails, you are asked before anything is applied.
6. Only the changed scripts are replaced. Threads running a changed script stop; the rest of the project keeps running. Variables keep their current values unless you edited their declaration.

If the project changes while an apply is running, for example because a script moved in Blocks mode, the apply is refused with **The project changed while applying, try again**.

After an apply your text stays exactly as you typed it, with your blank lines, indentation, spacing, comments and order. If you kept typing during the apply, your newer text stays too.

When blocks change somewhere else, for example in Blocks mode, through [fractch live reload](#fractch-live-reload) or with **Undo code change**, only the scripts, declarations and comments that changed are rewritten in their canonical form. Everything else keeps your formatting. If a script moves into or out of a region, or an import or monitor line changes, the file follows the canonical order again, but the scripts that did not change still keep their formatting.

Formatting is not yet kept when the project is reloaded. Opening or reloading a project shows its text in the canonical form. Unapplied text that comes back after a reload keeps its formatting, but it is compared with that canonical text, so a script you only reformatted counts as edited if blocks change it later.

If the lines outside your scripts, such as `watch`, `import` or `use` lines, no longer match the project after an apply, those lines are rewritten from the project while your scripts keep their formatting.

## Rename a Stage variable

A Stage variable is global, so renaming it touches the Stage and every sprite that uses it. Edit them together and apply them together:

1. In the Stage file, change `var score` to the new name, for example `var total`.
2. In each sprite file, change the uses of `score` to `total`.
3. Click **Apply all**.

The Stage creates `total`, the sprites switch to it, and `score` is deleted. Applying one of these files on its own is refused:

- Applying the Stage first fails with **score is used by Sprite1**, because the sprites' blocks still use `score`.
- Applying a sprite first fails because assigning `total` there would make a new variable only that sprite can see, while the Stage text you have not applied yet declares `total`.

Both messages suggest **Apply all**. A file is only counted as using a Stage variable when its code reads or sets it. A name in a string, a comment, a `local` of the same name, or `sprites["Sprite1"].vars["score"]` does not count, and neither does using a Stage list of the same name, so you can turn `var score` into `var score = []` in one Apply all when the sprites switch to list blocks.

Two changes can't be done in one Apply all, and are refused before anything changes:

- **Moving a Stage variable into one sprite.** Removing `var score` from the Stage while a sprite adds its own `var score` is refused, because the sprite's variable would share a name with the Stage variable that is still there. First apply the sprite with a different name for its variable, then apply the Stage without `score`, then rename the sprite's variable back and apply again.
- **Making a used Stage variable a cloud variable, or the other way round.** Changing `var score` to `cloud score` while sprites use `score` is refused. Remove the uses of `score` and apply all without it first, then add `cloud score` and the uses back and apply all again.

## Rename a Stage variable

A Stage variable is global, so renaming it touches the Stage and every sprite that uses it. Edit them together and apply them together:

1. In the Stage file, change `var score` to the new name, for example `var total`.
2. In each sprite file, change the uses of `score` to `total`.
3. Click **Apply all**.

The Stage creates `total`, the sprites switch to it, and `score` is deleted. Applying one of these files on its own is refused:

- Applying the Stage first fails with **score is used by Sprite1**, because the sprites' blocks still use `score`.
- Applying a sprite first fails because assigning `total` there would make a new variable only that sprite can see, while the Stage text you have not applied yet declares `total`.

Both messages suggest **Apply all**. A file is only counted as using a Stage variable when its code reads or sets it. A name in a string, a comment, a `local` of the same name, or `sprites["Sprite1"].vars["score"]` does not count, and neither does using a Stage list of the same name, so you can turn `var score` into `var score = []` in one Apply all when the sprites switch to list blocks.

Two changes can't be done in one Apply all, and are refused before anything changes:

- **Moving a Stage variable into one sprite.** Removing `var score` from the Stage while a sprite adds its own `var score` is refused, because the sprite's variable would share a name with the Stage variable that is still there. First apply the sprite with a different name for its variable, then apply the Stage without `score`, then rename the sprite's variable back and apply again.
- **Making a used Stage variable a cloud variable, or the other way round.** Changing `var score` to `cloud score` while sprites use `score` is refused. Remove the uses of `score` and apply all without it first, then add `cloud score` and the uses back and apply all again.

## Locked scripts

A few scripts cannot be shown as text and converted back exactly, for example ones using a block fractch cannot represent the same way. These scripts are **locked**: a lock icon sits in the gutter, their lines are read-only, and hovering the icon shows the reason and a **Show block** button. The strip says how many scripts are locked.

Locked scripts are always kept exactly as they are. You can type around them and delete a whole locked script, but to change one, edit it in Blocks mode.

## Conflicts

If blocks change while a tab has unapplied text, for example in Blocks mode or through [fractch live reload](#fractch-live-reload), the text is merged script by script. Scripts you did not edit take the new version; scripts you edited keep yours. When the same script changed on both sides, the strip shows a conflict and **Resolve** opens each script side by side so you can keep your text or use the block version. Apply is disabled until every conflict is resolved.

## Undo and redo

- Inside a script tab, `Ctrl+Z` and `Ctrl+Shift+Z` undo and redo typing.
- **Edit**, **Undo code change** and **Redo code change** undo and redo whole applies. An **Apply all** is one entry, so one undo reverts every file it changed and removes the Stage variables it created. Cloud variables and variables with a monitor showing on the stage are kept. With the explorer or panel focused, `Ctrl+Z` undoes the most recent apply or deletion.
- An apply can only be undone while the scripts it changed are still as it left them. For an **Apply all**, that means every file it changed. If blocks changed since, a dialog explains why and offers **Show changes** and **Open restore points**.

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
