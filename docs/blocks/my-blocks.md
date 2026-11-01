---
title: My Blocks (custom blocks)
sidebar_label: My Blocks
description: Make your own blocks, give them inputs, run them without screen refresh, and turn them into reporters.
---

# My Blocks (custom blocks)

My Blocks lets you define your own blocks, also called custom blocks or procedures. A custom block bundles a script under a single name so you can reuse it, which keeps projects shorter and easier to read. A custom block is like a function: define it once, then call it from anywhere in that sprite.

## Making a block

1. Open **My Blocks** in the [blocks palette](/editor/blocks-palette) and click **Make a Block**.
2. In the editor that opens, type the block's text. Click the buttons to add inputs and labels as you go:
   - **Add an input (number or text)**: a slot that accepts any value, passed into the definition as a reporter.
   - **Add an input (boolean)**: a hexagonal slot that accepts a true or false condition.
   - **Add a label**: plain text between inputs, so the block reads like a sentence (for example `move` `[steps]` `at speed` `[speed]`).
3. Optionally tick **Run without screen refresh** (see below).
4. Click **OK**.

You get two things: a **define** hat block in the workspace, and a new block in the palette. Put the script you want to reuse under the define hat.

## The pieces

- **define `my block`** (hat) marks where a custom block's script begins. This is what runs when the block is called.
- **`my block`** (the block you named) is a stack block in the palette. Calling it runs its `define` script.
- **Argument reporters** appear on the `define` hat for each input you added. Drag them into the script to use the value passed in for that call. Number and text inputs are rounded reporters, boolean inputs are hexagonal.

## Run without screen refresh

By default a custom block redraws the stage between steps like any other script. **Run without screen refresh** (also called warp mode) makes the whole block finish in a single frame, without pausing to redraw. This is the standard way to make a fast helper (drawing, list processing, maths) run instantly instead of one loop iteration per frame.

Be careful with long or infinite loops inside such a block: they can freeze the project. The [warp timer](/advanced/warp-timer) setting guards against many of these freezes.

## Editing and deleting

Right-click the **define** hat to edit the block's inputs, or right-click the block in the palette to delete it. You cannot delete a custom block while a script still uses it. Custom blocks belong to the sprite that defines them, so duplicating or exporting the sprite carries them along.

## Reporters and the return block

Scratch custom blocks are commands only: they run, but do not report a value. MistWarp adds custom reporters so a custom block can return a value:

- Right-click a custom block's define hat and choose **Change To Reporter** (or **Change To Statement** to turn it back). A reporter-shaped custom block can be dropped into any input, just like `x position`.
- **return `value`** (`procedures_return`) stops the current custom block and hands the value back to the caller. Used outside a custom block, it stops the script.

Projects that use these blocks will not run unchanged on scratch.mit.edu. If you need Scratch compatibility, the **Vanilla Compatible Blocks Only** [setting](/editor/settings) hides them.

## Detecting the runtime

Boolean argument reporters recognise two special names even when no such argument exists. An `is compiled?` boolean reports true when the [compiler](/advanced/javascript) is running the project, and an `is mistwarp?` boolean always reports true in MistWarp. They let a project detect where it is running. See [MistWarp extras](/blocks/mistwarp-extras) for the other blocks MistWarp adds.

## See also

- [The block workspace](/editor/workspace)
- [Control blocks](/blocks/control)
- [Custom C blocks](/building-extensions/custom-c-blocks) for extension authors
