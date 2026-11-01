---
title: Extension API (the Scratch object)
sidebar_label: Extension API
description: The global Scratch object that extensions use, with every BlockType, ArgumentType, ReturnType, permission helper and the block utility.
---

# Extension API

An extension adds a category of blocks to the palette. This page is the reference for the
author-facing runtime API: the global `Scratch` object, the `BlockType` and `ArgumentType`
enums, and the registration entry point. For a step-by-step guide, start with
[Building Extensions](/building-extensions/introduction).

An extension is a class with a `getInfo()` method that describes its blocks, plus one method per
block. It registers itself with `Scratch.extensions.register`.

```js
class MyExtension {
    getInfo () {
        return {
            id: 'myextension',
            name: 'My Extension',
            color1: '#ff4c4c',
            blocks: [
                {
                    opcode: 'addTwo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'add [A] and [B]',
                    arguments: {
                        A: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2}
                    }
                }
            ]
        };
    }
    addTwo (args) {
        return Scratch.Cast.toNumber(args.A) + Scratch.Cast.toNumber(args.B);
    }
}
Scratch.extensions.register(new MyExtension());
```

## The `Scratch` object

For unsandboxed extensions, `Scratch` is a global. Its always-present members come from
`scratch-vm/src/extension-support/tw-extension-api-common.js`:

- `Scratch.ArgumentType`, `Scratch.BlockType`, `Scratch.TargetType`, `Scratch.BlockShape`,
  `Scratch.ReturnType`: the enums below.
- `Scratch.Cast`: the [type coercion helpers](/api-reference/utilities) blocks use to normalize
  their inputs. Use these instead of raw `Number(...)` or `String(...)`.

Sandboxed extensions get a limited `Scratch`. `Scratch.vm`, `Scratch.renderer`, the block utility
and the permission helpers are unsandboxed only. Check `Scratch.extensions.unsandboxed` before
using any of them.

Unsandboxed extensions get more, added per extension when the script runs
(`tw-unsandboxed-extension-runner.js`):

- `Scratch.extensions.register(extensionObject)`: register your extension. `Scratch.extensions.unsandboxed`
  is `true` in this environment.
- `Scratch.vm`: the live [`VirtualMachine`](/api-reference/vm-api).
- `Scratch.renderer`: the attached [renderer](/api-reference/renderer-api).
- `Scratch.translate`: format-message helper for localized strings.
- Permission checks (each returns a `Promise<boolean>`): `Scratch.canFetch(url)`,
  `Scratch.canOpenWindow(url)`, `Scratch.canRedirect(url)`, `Scratch.canDownload(url, name)`,
  `Scratch.canEmbed(url)`, `Scratch.canRecordAudio()`, `Scratch.canRecordVideo()`,
  `Scratch.canReadClipboard()`, `Scratch.canNotify()`, `Scratch.canGeolocate()`.
- Guarded actions (each checks the matching permission first, then acts):
  `Scratch.fetch(url, options)`, `Scratch.download(url, file)`, `Scratch.openWindow(url, features)`,
  `Scratch.redirect(url)`.

Always route network and window access through these helpers. They ask the VM's security manager,
which is how the user stays in control of what an extension may reach. See
[Sandboxed vs unsandboxed](/building-extensions/unsandboxed).

## BlockType

From `extension-support/block-type.js`:

| Value | Meaning |
| --- | --- |
| `BlockType.COMMAND` (`'command'`) | Stack block that runs an action. |
| `BlockType.REPORTER` (`'reporter'`) | Returns a number or string. |
| `BlockType.BOOLEAN` (`'Boolean'`) | Hexagonal reporter returning true/false. |
| `BlockType.HAT` (`'hat'`) | Starts a stack when its condition becomes true. |
| `BlockType.EVENT` (`'event'`) | Hat with no predicate; runs when the matching event is fired. |
| `BlockType.CONDITIONAL` (`'conditional'`) | C-block; may run a branch, then continues. |
| `BlockType.LOOP` (`'loop'`) | C-block; re-evaluates after each branch run. |
| `BlockType.BUTTON` (`'button'`) | A palette button, not a runnable block. |
| `BlockType.LABEL` (`'label'`) | A text label in the palette, not a block. |
| `BlockType.XML` (`'xml'`) | Arbitrary scratch-blocks XML. |

## ArgumentType

From `extension-support/argument-type.js`. The type controls which input editor the argument
shows:

| Value | Input shown |
| --- | --- |
| `ArgumentType.NUMBER` (`'number'`) | Number field. |
| `ArgumentType.STRING` (`'string'`) | Text field. |
| `ArgumentType.BOOLEAN` (`'Boolean'`) | Hexagonal boolean slot (no default value). |
| `ArgumentType.ANGLE` (`'angle'`) | Number field with an angle picker. |
| `ArgumentType.COLOR` (`'color'`) | Color picker. |
| `ArgumentType.MATRIX` (`'matrix'`) | 5x5 matrix field. |
| `ArgumentType.NOTE` (`'note'`) | Piano note picker. |
| `ArgumentType.IMAGE` (`'image'`) | Inline image in the block label (not a real input). |
| `ArgumentType.COSTUME` (`'costume'`) | Dropdown of the current target's costumes. |
| `ArgumentType.SOUND` (`'sound'`) | Dropdown of the current target's sounds. |

In `getInfo`, each argument entry takes `type`, an optional `defaultValue`, and an optional `menu`
(the name of a menu defined in the extension's `menus`).

## ReturnType

From `compiler/enums.js`, exposed as `Scratch.ReturnType` and as `vm.exports.compiler.types`. A
compiled block declares its result type with `returnType` in `getInfo`:

| Value | Meaning |
| --- | --- |
| `ReturnType.ANY` (`'any'`) | Unknown; safe but least optimised. |
| `ReturnType.NUMBER` (`'numberOrNaN'`) | A number. A Scratch number can be `NaN`; this is the safe default. |
| `ReturnType.NUMBER_NEVER_NAN` (`'number'`) | A real number that is never `NaN`. |
| `ReturnType.STRING` (`'string'`) | A string. |
| `ReturnType.BOOLEAN` (`'boolean'`) | A boolean. |
| `ReturnType.COMMAND` (`'command'`) | A stack block that produces no value. |

See [Compiled extensions](/building-extensions/compiled/overview).

## TargetType

From `extension-support/target-type.js`: `TargetType.SPRITE` (`'sprite'`) and `TargetType.STAGE`
(`'stage'`). Used by filter fields such as a block's `filter` array.

## Block methods

Each block's `opcode` maps to a method on the extension instance. It receives `(args, util)`:

- `args`: an object keyed by argument name, holding the current input values (coerce with
  `Scratch.Cast`).
- `util`: the block utility, described below.

A reporter returns its value. A command returns nothing. Returning a `Promise` makes the block
asynchronous. See [waiting for things that aren't instant](/building-extensions/async).

## The block utility

Unsandboxed block functions receive `util` as their second parameter. It is only valid while the
block runs, so do not store it. See [unsandboxed extensions](/building-extensions/unsandboxed).

```js
myBlock (args, util) {
    const target = util.target;     // the sprite running the block
    const runtime = util.runtime;   // the runtime
    const thread = util.thread;     // the running thread
    const frame = util.stackFrame;  // scratch space for this block invocation
}
```

Common uses:

```js
util.target.x; util.target.y; util.target.direction; util.target.size;
util.target.setXY(100, 50);
util.target.setDirection(90);

const score = util.target.lookupVariableByNameAndType('score', '');
if (score) score.value = 100;

util.startHats('event_whenbroadcastreceived', {BROADCAST_OPTION: 'go'});

util.startBranch(1, true);
```

`lookupVariableByNameAndType` takes `''` for a variable and `'list'` for a list. `startHats` is
covered in [events and hats](/building-extensions/hats), and `startBranch` in
[custom C blocks](/building-extensions/custom-c-blocks). [Threads](/api-reference/threads)
explains what `util.thread` holds.

## Permissions

Unsandboxed extensions must ask before reaching the network or the outside world:

```js
if (await Scratch.canFetch(url)) {
    const socket = new WebSocket(url);
}
const response = await Scratch.fetch(url);

await Scratch.openWindow(url);
await Scratch.redirect(url);

await Scratch.canRecordAudio();
await Scratch.canRecordVideo();
await Scratch.canReadClipboard();
await Scratch.canNotify();
await Scratch.canGeolocate();
```

Use `Scratch.fetch` instead of `fetch`, and check `Scratch.canFetch` before opening a WebSocket
or loading an image from a URL the project chose.

## Translation

`Scratch.translate` marks strings for translation and fills in placeholders:

```js
const message = Scratch.translate({
    id: 'myextension.hello',
    default: 'Hello {name}!',
    description: 'Greeting'
}, {name: args.NAME});
```

## Editing Blockly directly

For deep editor customization you can reach the global `ScratchBlocks` object. See the
[GUI API](/api-reference/gui-api) for details.

## See also

- [Hello, world!](/building-extensions/hello-world) for a step-by-step start
- [Block registration](/api-reference/block-registration) for how `getInfo` becomes real blocks
- [VM API](/api-reference/vm-api), [Renderer API](/api-reference/renderer-api) and [Audio API](/api-reference/audio-api)
- [Utilities](/api-reference/utilities) for `Cast` and friends
