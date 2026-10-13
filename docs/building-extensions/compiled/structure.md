---
title: Extension structure
sidebar_position: 2
---

# Extension structure

A compiled extension is a normal extension plus a compiler entry. There are two ways to declare that entry: `Scratch.vm.exports.compiler.register`, or a `compFunc` on the block in `getInfo`. This page covers both. The [next page](/building-extensions/compiled/first-extension) builds a full example.

## The `compFunc` skeleton

The shortest form declares the compiler function on the block itself. No separate registration call is needed:

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const { BlockType, ArgumentType, ReturnType } = Scratch;

  class MathUtils {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        blocks: [
          {
            opcode: 'square',
            blockType: BlockType.REPORTER,
            text: 'square of [NUMBER]',
            arguments: { NUMBER: { type: ArgumentType.NUMBER, defaultValue: 5 } },
            returnType: ReturnType.NUMBER, // optional; see below
            compFunc: 'comp_square' // or this.comp_square
          }
        ]
      };
    }
    // Compiler data for this specific block. Returns JavaScript source.
    comp_square(args, { cast }) {
      return `(${cast.toNumber(args.NUMBER)} ** 2)`;
    }
    // Interpreter fallback: runs when the block is not compiled.
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
  }
  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

## The `compiler.register` skeleton

The explicit form separates the compiler entry from the block definition:

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const { vm, BlockType, ArgumentType } = Scratch;
  const { compiler } = vm.exports;
  const T = compiler.types; // ANY, NUMBER, NUMBER_NEVER_NAN, STRING, BOOLEAN, COMMAND

  // 1. Tell the compiler how to generate JavaScript for each block.
  compiler.register('mathutils', {
    square: {
      type: T.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    }
  });

  // 2. Register the extension normally, with a fallback func per block.
  class MathUtils {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        blocks: [
          {
            opcode: 'square',
            blockType: BlockType.REPORTER,
            text: 'square of [NUMBER]',
            arguments: { NUMBER: { type: ArgumentType.NUMBER, defaultValue: 5 } }
          }
        ]
      };
    }
    // Interpreter fallback: runs when the block is not compiled.
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
  }
  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

In both forms, the block's `opcode` (`square`) and the extension `id` (`mathutils`) tie the compiler entry to the block: internally the entry is keyed as `mathutils_square`, which is exactly the block's full opcode.

Which to use: `compFunc` keeps the compiler logic next to the block and is the recommended default. Use `compiler.register` when you would rather keep all compiler entries in one place, or when you must register before `getInfo` runs.

## compiler.register(extensionId, blocks)

- `extensionId`: your extension's `id`, the same string you pass in `getInfo`.
- `blocks`: an object mapping each block's `opcode` to a descriptor.

Each descriptor has:

| Field | Description |
|:--|:--|
| `type` | One of `compiler.types`. It is the type of value the block produces (or `COMMAND` for a stack block). |
| `compile` | A function that returns a **string of JavaScript source** for the block. |

`compiler.types` is the same enum as [`Scratch.ReturnType`](#result-type):

| Type | Use for |
|:--|:--|
| `NUMBER` | A reporter that produces a number. A Scratch number can be `NaN`; this is the safe default. |
| `NUMBER_NEVER_NAN` | A reporter that always produces a real number, never `NaN`. |
| `STRING` | A reporter that produces a string. |
| `BOOLEAN` | A boolean reporter. |
| `ANY` | A reporter whose type is not known ahead of time. |
| `COMMAND` | A stack block that runs an action and returns nothing. |

Picking a specific type helps the compiler skip redundant conversions downstream. `NUMBER` is safe for anything that returns "a number"; use `NUMBER_NEVER_NAN` only when you are certain the result cannot be `NaN`.

## The compile context

`compile` receives one object:

```js
compile: ({ input, field, mutation, runtime, target, stage }) => `...`
```

| Property | What it gives you |
|:--|:--|
| `input(name)` | JavaScript source for input `name`, coerced to "any". |
| `input.number(name)` | Input source coerced to a number. |
| `input.string(name)` | Input source coerced to a string. |
| `input.boolean(name)` | Input source coerced to a boolean. |
| `input.numberOrNaN(name)` | Input source coerced to a number that may be `NaN`. |
| `input.raw(name)` | Input source with no coercion. For a literal, this is the bare value. |
| `field(name)` | The value of field `name`, already JSON-encoded (safe to drop into source as a string literal). |
| `mutation` | The block's mutation object (used for variadic blocks). |
| `runtime`, `target`, `stage` | The variable names, as strings, that refer to the runtime, the current target, and the stage in the generated code. Use them to reach engine state. |

The key mental model: `compile` runs at compile time and returns **text**. The `input.*` helpers return text (a JavaScript expression), and you assemble a larger expression by string interpolation. What you return is spliced into the compiled script and executed at run time.

## The compFunc form

`compFunc` is the same idea with a different calling convention: it runs at compile time and returns a string of JavaScript source, exactly like `compile`.

```js
compFunc(args, util)
// args: one entry per block argument and per block field
// util: { cast, input, field, mutation, runtime, target, stage }
// returns: string (JavaScript source)
```

The result type comes from the block's `returnType`, not from the return value; see [Result type](#result-type).

### The cast helpers

`args.NUMBER` is not a runtime value; it is a token that identifies the block argument. Putting it in a template string gives the argument coerced to "any":

```js
comp_double(args) {
  return `(${args.NUMBER} * 2)`;
}
```

Use a `cast` helper when you need a specific type instead. Each turns a token (or the argument's name as a string) into JavaScript source for that argument, coerced to the type:

| Helper | Emits |
|:--|:--|
| `cast.toAny(token)` | The argument, coerced to "any". Same as `${token}`. |
| `cast.toNumber(token)` | Coerced to a number. |
| `cast.toNumberOrNaN(token)` | Coerced to a number that may be `NaN`. |
| `cast.toString(token)` | Coerced to a string. |
| `cast.toBoolean(token)` | Coerced to a boolean. |
| `cast.toRaw(token)` | No coercion. |

A field (a dropdown value) also appears in `args`; interpolating it, or passing it to any `cast` helper, serializes it as a JSON literal.

```js
comp_square(args, { cast }) {
  return `(${cast.toNumber(args.NUMBER)} ** 2)`;
}
```

### Result type

The compiler needs each block's result type before the block is compiled, so it takes it statically, in this order:

1. `returnType` (or `type`) on the block descriptor, one of `Scratch.ReturnType`.
2. The block type: `Boolean` blocks are `BOOLEAN`, command blocks are `COMMAND`.
3. A `reporter` with no `returnType` defaults to `ANY`.

`Scratch.ReturnType` has the same values as `vm.exports.compiler.types`:

| Member | Meaning |
|:--|:--|
| `ReturnType.NUMBER` | A number. A Scratch number can be `NaN`, so this is the safe default. |
| `ReturnType.NUMBER_NEVER_NAN` | A real number that is never `NaN`. Use only when you are certain. |
| `ReturnType.STRING` | A string. |
| `ReturnType.BOOLEAN` | A boolean. |
| `ReturnType.ANY` | Unknown; safe but least optimised. |
| `ReturnType.COMMAND` | A stack block that produces no value. |

So a reporter that returns a number should say so, or the compiler will fall back to `ANY` and insert conversions it did not need:

```js
{
  opcode: 'square',
  blockType: BlockType.REPORTER,
  returnType: ReturnType.NUMBER, // narrows the result for the compiler
  compFunc: 'comp_square'
}
```

An explicit `compiler.register` entry for the same opcode takes precedence over `compFunc`.

## Real built-in examples

MistWarp's own operators are registered exactly this way. A few, verbatim from the engine:

```js
// number result
power:   ({ input: i }) => `Math.pow(${i.number('A')}, ${i.number('B')})`,
clamp:   ({ input: i }) => `Math.min(Math.max(${i.number('A')}, ${i.number('B')}), ${i.number('C')})`,

// boolean result
notequals: ({ input: i }) => `(${i.string('A')} !== ${i.string('B')})`,
starts:    ({ input: i }) => `(${i.string('A')}).startsWith(${i.string('B')})`,

// string result
replaceall: ({ input: i }) => `(${i.string('A')}).replaceAll(${i.string('C')}, ${i.string('B')})`,

// reaching runtime state
stagewidth: ({ runtime }) => `${runtime}.stageWidth`,

// no inputs
pi: () => 'Math.PI',
```

`compile` must return a string. Wrap expressions in parentheses when precedence could bite you: an input might expand to something like `a + b`, and `${i.number('A')} ** 2` without parentheses around the input would parse wrong.

## Fallback functions

The block still needs its normal method in the class (`square(args)` above). It runs when the block is not compiled: when a reporter feeds a monitor, when the compiler is disabled, or in any environment without MistWarp's compiler. Keep the fallback behavior identical to the compiled version so results never differ.

## Next steps

[Build a first compiled extension](/building-extensions/compiled/first-extension) end to end.
