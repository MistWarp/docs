---
title: Your first compiled extension
sidebar_position: 4
---

# Your first compiled extension

Let's build a small "Math Utils" extension with two compiled reporters, `square` and `power`, using the [`compFunc` API](/building-extensions/compiled/structure).

## Boilerplate

Compiled extensions must run unsandboxed, so start with the check and pull out the pieces you need:

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Math Utils must run unsandboxed');
  }

  const { BlockType, ArgumentType, ReturnType } = Scratch;
```

## Add the blocks and their compiler functions

Each block names its compiler method with `compFunc`, and that method returns JavaScript source. Both reporters produce numbers, so both declare `returnType: ReturnType.NUMBER` and use `cast.toNumber`:

```js
  class MathUtils {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        color1: '#4C97FF',
        blocks: [
          {
            opcode: 'square',
            blockType: BlockType.REPORTER,
            text: 'square of [NUMBER]',
            arguments: {
              NUMBER: { type: ArgumentType.NUMBER, defaultValue: 5 }
            },
            returnType: ReturnType.NUMBER,
            compFunc: 'comp_square'
          },
          {
            opcode: 'power',
            blockType: BlockType.REPORTER,
            text: '[BASE] to the power of [EXPONENT]',
            arguments: {
              BASE: { type: ArgumentType.NUMBER, defaultValue: 2 },
              EXPONENT: { type: ArgumentType.NUMBER, defaultValue: 3 }
            },
            returnType: ReturnType.NUMBER,
            compFunc: 'comp_power'
          }
        ]
      };
    }

    // Compiled implementations. Each returns JavaScript source.
    comp_square(args, { cast }) {
      return `(${cast.toNumber(args.NUMBER)} ** 2)`;
    }
    comp_power(args, { cast }) {
      return `Math.pow(${cast.toNumber(args.BASE)}, ${cast.toNumber(args.EXPONENT)})`;
    }

    // Interpreter fallbacks: run when the block is not compiled.
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
    power(args) {
      return Math.pow(Scratch.Cast.toNumber(args.BASE), Scratch.Cast.toNumber(args.EXPONENT));
    }
  }

  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

`cast.toNumber(args.NUMBER)` expands to a JavaScript expression that evaluates the `NUMBER` input and coerces it to a number. The parentheses around `square` matter: `NUMBER` might expand to something like `a + b`, and `a + b ** 2` would apply `**` before `+`.

## Using compiler.register instead

If you would rather keep the compiler logic out of the class, register it separately. The opcodes must match the blocks, and the type moves from `returnType` to `type`:

```js
  Scratch.vm.exports.compiler.register('mathutils', {
    square: {
      type: ReturnType.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    },
    power: {
      type: ReturnType.NUMBER,
      compile: ({ input }) => `Math.pow(${input.number('BASE')}, ${input.number('EXPONENT')})`
    }
  });
```

The blocks then only need their interpreter fallback methods. An entry registered this way always takes precedence over a `compFunc` for the same opcode. `register` also accepts the string values directly (`'number'` and so on).

That is the complete extension.

## Testing it

1. Load it unsandboxed in the editor (from `http://localhost:8000/` or with the "run without sandbox" option; see [Unsandboxed extensions](/building-extensions/unsandboxed)).
2. Use `square of (5)` and confirm it reports `25`.
3. Feed it inputs of different kinds: a literal, a variable, and a nested reporter like `square of ((3 + 2))`. All should work, because `cast.toNumber` compiles whatever expression the input produces.
4. Check the fallback: put a `square of` reporter on the stage as a monitor (click its checkbox). Monitors run uncompiled, so this exercises the `square(args)` method. The value should match.

Keep the fallback and the compiled version in lockstep. If they can disagree, projects will behave differently depending on whether the compiler is on, which is a confusing bug to chase.

## Next steps

[Advanced compiled techniques](/building-extensions/compiled/advanced): command blocks, variadic inputs, raw inputs, and reaching runtime state.
