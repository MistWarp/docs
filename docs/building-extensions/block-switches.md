---
title: Block switches
sidebar_position: 10
---

# Block switches

Right-clicking a built-in block such as `set x to` offers `change x by` in its context menu, so a script can be adjusted without dragging in a new block and moving every input across. Extensions can offer the same for their own blocks by listing `switches` on a block.

Switches need the block switching addon, which is on by default. Users who turn it off see no extra menu items.

## Declaring switches

Each entry names another block in the same extension by its opcode. Inputs with the same name are carried over automatically.

```js
{
  opcode: 'setSpeed',
  blockType: Scratch.BlockType.COMMAND,
  text: 'set speed to [VALUE]',
  arguments: {
    VALUE: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}
  },
  switches: ['changeSpeed']
},
{
  opcode: 'changeSpeed',
  blockType: Scratch.BlockType.COMMAND,
  text: 'change speed by [VALUE]',
  arguments: {
    VALUE: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}
  },
  switches: ['setSpeed']
}
```

Declare the switch on every block that should offer it. Listing `changeSpeed` on `setSpeed` does not add the reverse entry.

## Objects with options

An entry can be an object when the two blocks do not line up exactly.

```js
switches: [
  {
    id: 'setSpeedFor',
    inputs: [['VALUE', 'SPEED']]
  },
  {
    id: 'motion_movesteps',
    rawId: true,
    text: 'move _ steps',
    inputs: [['VALUE', 'STEPS']]
  }
]
```

- `id` is the opcode of the block to switch to. It is required.
- `inputs` maps input names on this block to input names on the other block, as `[from, to]` pairs. Inputs that are not listed keep their name.
- `splitInputs` lists inputs to drop. Any block attached to one of them is left on the workspace next to the new block instead of being deleted.
- `rawId` uses `id` as a complete opcode instead of prefixing it with the extension id. Use it to switch to a built-in block or a block from another extension. Set `text` as well, because the menu cannot look up the label of a block outside the extension.

The menu label is the other block's `text` with each input shown as `_`.

## Behaviour

Switching keeps the block's position, its connection to the blocks above and below, its comments, and every input whose name still exists on the new block. Inputs the new block does not have are removed unless they are listed in `splitInputs`. The change is a single undo step.

Switches only apply to blocks from the same `getInfo()` call, so an opcode that does not exist in the extension is ignored rather than producing a broken block.
