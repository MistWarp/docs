---
title: Utilities
description: Scratch.Cast and the other helper modules in scratch-vm, with examples of Scratch's number, string, boolean and list index rules.
---

# Utilities

`scratch-vm/src/util/` holds small helper modules the engine uses everywhere. Extension authors
most often need `Cast`, which extensions get as `Scratch.Cast` in both sandboxed and unsandboxed
mode. The rest are handy when you work with the VM directly.

## Cast

`util/cast.js` implements Scratch's type coercion rules. Scratch is loosely typed, so a block that
expects a number must accept `"5"`, `true` or `"apple"` and behave predictably. A block argument
can be any type regardless of its declared `type` (see [dealing with inputs](/building-extensions/inputs)),
so cast values before you use them. Using `Cast` keeps your blocks behaving the same way built-in
blocks do, instead of following JavaScript's defaults.

### Number conversion

```js
const Cast = Scratch.Cast;

Cast.toNumber('42');      // 42
Cast.toNumber('3.14');    // 3.14
Cast.toNumber('123abc');  // 123
Cast.toNumber('abc');     // 0
Cast.toNumber('');        // 0
Cast.toNumber(true);      // 1
Cast.toNumber(false);     // 0
Cast.toNumber(null);      // 0
Cast.toNumber(NaN);       // 0  (Scratch maps NaN to 0)
```

### String conversion

`Cast.toString(value)` is `String(value)` with Scratch's expectations around it.

```js
Cast.toString(42);     // '42'
Cast.toString(true);   // 'true'
Cast.toString(null);   // 'null'
```

Do not rely on it to format arrays or objects in any Scratch-specific way. It uses JavaScript's default `String()`.

### Boolean conversion

Scratch's boolean rules differ from JavaScript's: the strings `''`, `'0'`, and `'false'` are all false.

```js
Cast.toBoolean(true);       // true
Cast.toBoolean('');         // false
Cast.toBoolean('0');        // false
Cast.toBoolean('false');    // false
Cast.toBoolean('anything'); // true
Cast.toBoolean(0);          // false
Cast.toBoolean(1);          // true
```

### Comparison

`Cast.compare(a, b)` returns a negative number, zero, or a positive number. It compares numerically when both sides look like numbers, otherwise case-insensitively as strings.

```js
Cast.compare('10', '9');        // > 0  (numeric: 10 > 9)
Cast.compare('apple', 'banana'); // < 0  (string)
Cast.compare('5', '5');          // 0
```

Always test with `< 0`, `> 0`, or `=== 0`. Never `=== 1` or `=== -1`, because the magnitude is not guaranteed.

### Type checks

```js
Cast.isInt(42);     // true
Cast.isInt('42');   // true (coerced)
Cast.isInt(3.14);   // false
Cast.isWhiteSpace(' '); // true
```

### Colors

```js
Cast.toRgbColorList('#ff0000');   // [255, 0, 0]
Cast.toRgbColorObject('#00ff00'); // {r: 0, g: 255, b: 0}
```

### List indices

`Cast.toListIndex(index, length, acceptAll)` converts a Scratch list index (1-based, with support for `"last"`, `"random"`, and `"all"`) into a usable index, or `Cast.LIST_INVALID` when out of range.

```js
const i = Cast.toListIndex(args.INDEX, list.value.length, false);
if (i !== Cast.LIST_INVALID) {
  return list.value[i - 1];
}
```

## Color

`util/color.js` converts between color representations. Values are `{r, g, b}` objects (0 to 255),
`#rrggbb` hex strings, HSV objects (`{h, s, v}`), or 24-bit decimals.

`Color.decimalToHex`, `Color.decimalToRgb`, `Color.hexToRgb`, `Color.rgbToHex`,
`Color.rgbToDecimal`, `Color.hexToDecimal`, `Color.hsvToRgb`, `Color.rgbToHsv`, and
`Color.mixRgb(rgb0, rgb1, fraction1)` to blend two colors.

## MathUtil

`util/math-util.js`:

- `MathUtil.degToRad(deg)` / `MathUtil.radToDeg(rad)`.
- `MathUtil.clamp(n, min, max)`: constrain to a range.
- `MathUtil.wrapClamp(n, min, max)`: wrap around a range (like direction).
- `MathUtil.tan(angle)`: tangent in degrees, returning `Infinity` at the poles instead of a huge
  float.
- `MathUtil.scale(i, iMin, iMax, oMin, oMax)`: remap a number from one range to another.
- `MathUtil.inclusiveRandIntWithout(lower, upper, excluded)`: a random integer in a range, skipping
  one value.

## Other helpers

- `util/string-util.js` (`StringUtil`): string helpers, including `StringUtil.unusedName(name,
  existing)` for de-duplicating names.
- `util/uid.js`: generate unique IDs for blocks, variables, and targets.
- `util/base64-util.js` (`Base64Util`): convert between base64 and byte arrays for assets.
- `util/timer.js` (`Timer`): the millisecond timer the sequencer and blocks use.
- `util/clone.js` (`Clone`): shallow/deep copy helpers.
- `util/log.js`: the VM's logger.

## See also

- [Extension API](/api-reference/extension-api) for the rest of the `Scratch` object
- [Assorted APIs](/building-extensions/assorted-apis) for the `Scratch.Cast` tutorial example
- [VM API](/api-reference/vm-api)
