---
title: Advanced compiled techniques
sidebar_position: 5
---

# Advanced compiled techniques

This page covers the parts of the [`compiler.register` API](/building-extensions/compiled/structure) beyond a plain reporter: command blocks, fields, variadic inputs, raw inputs, and reaching runtime state. Everything here is verified against how MistWarp's own built-in operators are compiled.

Keep the mental model front of mind: the compiler function runs **once, at compile time**, and returns **JavaScript source**. It cannot do runtime work itself; it decides what runtime work the generated code will do. Anything that must react to the running project has to be inside the source you return.

## compFunc and register

This page uses the explicit `compiler.register` form because its `compile` context makes the pieces easy to name. Everything here applies equally to a [`compFunc`](/building-extensions/compiled/structure). The mapping is:

| `compiler.register` | `compFunc` |
|:--|:--|
| `compile: ({ input }) => ...` | `compFunc(args, { cast })` returning a source string |
| `type: T.NUMBER` | `returnType: ReturnType.NUMBER` on the block |
| `input('A')` | `${args.A}` (or `cast.toAny(args.A)`) |
| `input.number('A')` | `cast.toNumber(args.A)` |
| `input.numberOrNaN('A')` | `cast.toNumberOrNaN(args.A)` |
| `input.string('A')` | `cast.toString(args.A)` |
| `input.boolean('A')` | `cast.toBoolean(args.A)` |
| `input.raw('A')` | `cast.toRaw(args.A)` |
| `field('A')` | `${args.A}`, or `args.A` passed to any `cast` helper |
| `mutation`, `runtime`, `target`, `stage` | the same names on `util` |

The examples below are written with `compile`; translate with this table if you are using `compFunc`.

## Command blocks

Give the descriptor `type: COMMAND`. The string you return is used as a statement (the compiler appends `;`), so return an expression with a side effect:

```js
compiler.register('myext', {
  logmessage: {
    type: T.COMMAND,
    compile: ({ input }) => `console.log(${input.string('MESSAGE')})`
  }
});
```

To run several statements, wrap them in an immediately-invoked function:

```js
compile: ({ input, target }) =>
  `(() => { const n = ${input.number('N')}; ${target}.setXY(n, n); })()`
```

## C-shaped blocks

A loop or conditional block is still a `COMMAND` descriptor, but its `compile` context also gets `branch(n)` and, for loops, `yieldLoop()`. Return the control flow yourself and splice each arm:

```js
repeatUntil: {
  type: T.COMMAND,
  compile: ({ input: i, branch, yieldLoop }) => `
    while (!${i.boolean('CONDITION')}) {
      ${branch(1)}
      ${yieldLoop()}
    }
  `
}
```

`yieldLoop()` is not optional in a loop: it emits the correct yield for warp mode and the warp-timer option, and without it a non-warp loop hangs. `branch(n)` is a compile-time splice; call it where the branch should run, and do not wrap it in a callback. A compiler that leaves a non-empty branch out fails to compile and the script runs interpreted.

The interpreter fallback is the usual branch protocol:

```js
repeatUntil (args, util) {
  if (!Scratch.Cast.toBoolean(args.CONDITION)) util.startBranch(1, true);
}
```

If the loop's condition or header needs to wait on a promise, leave the block on the compatibility layer; a compiled header is a plain expression.

## Reaching runtime, target, and stage

The context gives you the variable names that refer to engine objects in the generated scope. Interpolate them into your source:

```js
compiler.register('myext', {
  stagewidth: {
    type: T.NUMBER,
    compile: ({ runtime }) => `${runtime}.stageWidth`
  },
  myx: {
    type: T.NUMBER,
    compile: ({ target }) => `${target}.x`
  }
});
```

`runtime` is the runtime, `target` is the target running the block, and `stage` is the stage. For example, the built-in stage width block compiles to a template that returns `runtime.stageWidth`.

## Fields

`field(name)` returns the field's value already JSON-encoded, so it is safe to splice as a string literal:

```js
compile: ({ field }) => `someTable[${field('CHOICE')}]`
// if the CHOICE field is "red", this becomes: someTable["red"]
```

## Input coercions

Pick the coercion that matches what your JavaScript expects. Choosing the right one avoids redundant conversions in the output.

| Helper | Emits |
|:--|:--|
| `input('A')` | The input, coerced to "any". |
| `input.number('A')` | Coerced to a number. |
| `input.numberOrNaN('A')` | Coerced to a number that may be `NaN`. |
| `input.string('A')` | Coerced to a string. |
| `input.boolean('A')` | Coerced to a boolean. |
| `input.raw('A')` | No coercion. For an operator dropdown, this is the bare operator text. |

`input.raw` is how a block that takes an operator as a field builds an expression. The built-in comparison block does exactly this:

```js
compare: {
  type: T.BOOLEAN,
  compile: ({ input: i }) => `(${i.number('A')} ${i.raw('C')} ${i.number('B')})`
}
// with C = "<", this becomes: (a < b)
```

Only use `raw` with values you control or a fixed menu. Splicing an arbitrary user string as raw source is an injection risk.

## Variadic inputs

Blocks that accept a variable number of inputs (like `min`/`max` of several values) read the count from `mutation`. This is verbatim how MistWarp compiles its variadic `min` and `max`:

```js
const variadic = (name, input, mutation) => {
  const count = Math.max(2, parseInt(mutation.itemcount, 10) || 2);
  const parts = Array.from({ length: count }, (_, i) => input.number(`NUM${i + 1}`));
  return `Math.${name}(${parts.join(',')})`;
};

compiler.register('myext', {
  min: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('min', input, mutation) },
  max: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('max', input, mutation) }
});
```

## Choosing the result type

`type` is the value the block produces, and the compiler uses it to skip conversions in the blocks that consume your output. Be honest:

- Use `NUMBER` for anything that returns a number. A Scratch number can be `NaN` (a parse that might fail), and `NUMBER` accounts for that.
- Use `NUMBER_NEVER_NAN` only when the result is guaranteed to be a real number, so the compiler can skip a `NaN` guard a caller would otherwise need.
- Use `ANY` when you cannot promise a type, for example a `JSON.parse` result.

```js
jsonparse: { type: T.ANY, compile: ({ input: i }) => `JSON.parse(${i.string('A')})` }
```

The type must be known before the block is compiled, so it is always static. With `compFunc` the type comes from `returnType` on the block descriptor if present, otherwise from the block type: a `Boolean` block is `BOOLEAN`, a command block is `COMMAND`, and a `reporter` with no `returnType` falls back to `ANY`.

## Precedence and parentheses

Inputs expand to whole expressions, not just literals, so parenthesize anything where operator precedence could change the meaning. Prefer wrapping the input and the whole result:

```js
// risky: input might be `a + b`
compile: ({ input: i }) => `${i.number('X')} ** 2`
// safe
compile: ({ input: i }) => `((${i.number('X')}) ** 2)`
```

## Keep the fallback in sync

Every compiled block still needs its interpreter method (see [Your first compiled extension](/building-extensions/compiled/first-extension)). It runs whenever the block is not compiled, so it must compute the same result. When you change the compiled logic, change the fallback too.

## What not to do

The compiler is deliberately narrow, and that is the point. It has no supported API for multi-pass compilation, hoisting shared helper functions into the output, hooking the compiler's lifecycle, or holding cross-block state at compile time. If you find yourself wanting those, the block is probably too big to be worth compiling; write it as a normal [unsandboxed block](/building-extensions/unsandboxed) instead.

## See also

- [Compiled extensions overview](/building-extensions/compiled/overview)
- [The legacy patching approach](/building-extensions/compiled/patching)
