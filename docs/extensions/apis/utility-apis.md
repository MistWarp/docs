---
name: Utilities
---

# Utility APIs

Scratch provides various utility functions and objects that help extension developers handle common tasks like data conversion, string manipulation, mathematical operations, and color processing. These utilities are accessible through different namespaces and provide Scratch-compatible behavior.

## Overview

Utility APIs include:
- **Cast**: Data type conversion with Scratch semantics
- **String utilities**: Text processing and manipulation
- **Math utilities**: Mathematical operations and comparisons
- **Color utilities**: Color format conversion and manipulation
- **Variable utilities**: Variable and list management helpers
- **Block utilities**: Block execution context and controls

## Cast Utilities

### `Scratch.Cast`

The primary data conversion utility that implements Scratch's type coercion rules.

#### Number Conversion

```js
const Cast = Scratch.Cast;

// Basic number conversion
Cast.toNumber('42')        // 42
Cast.toNumber('3.14')      // 3.14
Cast.toNumber('0.1e10')    // 1000000000
Cast.toNumber('')          // 0
Cast.toNumber('abc')       // 0
Cast.toNumber('123abc')    // 123

// Boolean to number
Cast.toNumber(true)        // 1
Cast.toNumber(false)       // 0

// Special cases
Cast.toNumber(null)        // 0
Cast.toNumber(undefined)   // 0
Cast.toNumber(Infinity)    // Infinity
Cast.toNumber(-Infinity)   // -Infinity
Cast.toNumber(NaN)         // 0 (Scratch converts NaN to 0)

// Practical usage in blocks
myMathBlock(args) {
  const a = Cast.toNumber(args.A);
  const b = Cast.toNumber(args.B);
  return a + b; // Safe addition regardless of input types
}
```

#### String Conversion

```js
// Basic string conversion
Cast.toString(42)          // '42'
Cast.toString(3.14)        // '3.14'
Cast.toString(true)        // 'true'
Cast.toString(false)       // 'false'
Cast.toString(null)        // ''
Cast.toString(undefined)   // ''

// Special number formatting
Cast.toString(0)           // '0'
Cast.toString(-0)          // '0'
Cast.toString(Infinity)    // 'Infinity'
Cast.toString(-Infinity)   // '-Infinity'

// Array and object handling
Cast.toString([1, 2, 3])   // '1 2 3' (Scratch list format)
Cast.toString({})          // '[object Object]'

// Usage in text blocks
myTextBlock(args) {
  const text = Cast.toString(args.INPUT);
  return text.toUpperCase();
}
```

#### Boolean Conversion

```js
// Scratch boolean semantics
Cast.toBoolean(true)       // true
Cast.toBoolean(false)      // false
Cast.toBoolean('')         // false
Cast.toBoolean('0')        // false
Cast.toBoolean('false')    // false
Cast.toBoolean('anything') // true
Cast.toBoolean(0)          // false
Cast.toBoolean(1)          // true
Cast.toBoolean(-1)         // true

// Usage in conditional blocks
myConditionBlock(args) {
  return Cast.toBoolean(args.CONDITION);
}
```

#### Comparison Operations

```js
// Scratch-style comparison
Cast.compare('10', '9')     // 1 (numeric comparison: 10 > 9)
Cast.compare('10', '2')     // 1 (numeric comparison: 10 > 2)
Cast.compare('apple', 'banana') // -1 (string comparison)
Cast.compare('10', 'apple') // 1 (mixed: number > string)

// Return values: -1 (less), 0 (equal), 1 (greater)

// Usage in comparison blocks
isGreater(args) {
  return Cast.compare(args.A, args.B) > 0;
}

isEqual(args) {
  return Cast.compare(args.A, args.B) === 0;
}
```

#### Type Checking

```js
// Integer checking
Cast.isInt(42)             // true
Cast.isInt(3.14)           // false
Cast.isInt('42')           // true (coerced)
Cast.isInt('3.14')         // false

// Usage in validation
myIntegerBlock(args) {
  const value = args.NUMBER;
  if (!Cast.isInt(value)) {
    return 'Not an integer';
  }
  return Cast.toNumber(value);
}
```

### Color Utilities

```js
// RGB color list conversion (Scratch format)
Cast.toRgbColorList('#ff0000')    // [255, 0, 0]
Cast.toRgbColorList('#00ff00')    // [0, 255, 0]
Cast.toRgbColorList('#0000ff')    // [0, 0, 255]
Cast.toRgbColorList('red')        // [255, 0, 0] (named colors)

// RGB color object
Cast.toRgbColorObject('#ff0000')  // {r: 255, g: 0, b: 0}

// Usage in color blocks
setPenColor(args) {
  const [r, g, b] = Cast.toRgbColorList(args.COLOR);
  // Use r, g, b values...
}
```

## String Utilities

### StringUtil

String manipulation utilities (available through `require` in VM context or via runtime).

```js
// In unsandboxed extensions, access through runtime
const StringUtil = Scratch.vm.runtime.constructor.require('../util/string-util');

// Common operations
StringUtil.isASCII('hello')        // true
StringUtil.isASCII('héllo')        // false

// String splitting
StringUtil.splitFirst('a.b.c', '.') // ['a', 'b.c']

// Usage in text processing blocks
splitText(args) {
  const text = Cast.toString(args.TEXT);
  const delimiter = Cast.toString(args.DELIMITER);
  return StringUtil.splitFirst(text, delimiter);
}
```

### Text Processing Helpers

```js
// Custom text utilities for extensions
class TextUtils {
  static reverseString(text) {
    return Cast.toString(text).split('').reverse().join('');
  }
  
  static countWords(text) {
    const str = Cast.toString(text).trim();
    return str === '' ? 0 : str.split(/\s+/).length;
  }
  
  static capitalizeWords(text) {
    return Cast.toString(text).replace(/\b\w/g, l => l.toUpperCase());
  }
  
  static removeSpaces(text) {
    return Cast.toString(text).replace(/\s/g, '');
  }
}

// Usage in extension blocks
reverseText(args) {
  return TextUtils.reverseString(args.TEXT);
}

wordCount(args) {
  return TextUtils.countWords(args.TEXT);
}
```

## Mathematical Utilities

### Basic Math Extensions

```js
class MathUtils {
  // Clamp value between min and max
  static clamp(value, min, max) {
    const num = Cast.toNumber(value);
    const minNum = Cast.toNumber(min);
    const maxNum = Cast.toNumber(max);
    return Math.max(minNum, Math.min(maxNum, num));
  }
  
  // Map value from one range to another
  static map(value, fromMin, fromMax, toMin, toMax) {
    const val = Cast.toNumber(value);
    const fMin = Cast.toNumber(fromMin);
    const fMax = Cast.toNumber(fromMax);
    const tMin = Cast.toNumber(toMin);
    const tMax = Cast.toNumber(toMax);
    
    return (val - fMin) * (tMax - tMin) / (fMax - fMin) + tMin;
  }
  
  // Check if number is between two values
  static between(value, min, max) {
    const num = Cast.toNumber(value);
    const minNum = Cast.toNumber(min);
    const maxNum = Cast.toNumber(max);
    return num >= minNum && num <= maxNum;
  }
  
  // Round to specified decimal places
  static roundTo(value, decimals) {
    const num = Cast.toNumber(value);
    const dec = Cast.toNumber(decimals);
    const factor = Math.pow(10, dec);
    return Math.round(num * factor) / factor;
  }
}

// Extension usage
getInfo() {
  return {
    id: 'mathutils',
    name: 'Math Utils',
    blocks: [
      {
        opcode: 'clamp',
        blockType: Scratch.BlockType.REPORTER,
        text: 'clamp [VALUE] between [MIN] and [MAX]',
        arguments: {
          VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
          MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
          MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
        }
      }
    ]
  };
}

clamp(args) {
  return MathUtils.clamp(args.VALUE, args.MIN, args.MAX);
}
```

### Trigonometric Utilities

```js
class TrigUtils {
  // Convert degrees to radians
  static degToRad(degrees) {
    return Cast.toNumber(degrees) * Math.PI / 180;
  }
  
  // Convert radians to degrees  
  static radToDeg(radians) {
    return Cast.toNumber(radians) * 180 / Math.PI;
  }
  
  // Normalize angle to 0-360 range
  static normalizeAngle(angle) {
    let norm = Cast.toNumber(angle) % 360;
    return norm < 0 ? norm + 360 : norm;
  }
  
  // Distance between two points
  static distance(x1, y1, x2, y2) {
    const dx = Cast.toNumber(x2) - Cast.toNumber(x1);
    const dy = Cast.toNumber(y2) - Cast.toNumber(y1);
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Angle between two points
  static angleTo(x1, y1, x2, y2) {
    const dx = Cast.toNumber(x2) - Cast.toNumber(x1);
    const dy = Cast.toNumber(y2) - Cast.toNumber(y1);
    return this.radToDeg(Math.atan2(dy, dx));
  }
}
```

## Color Utilities

### Advanced Color Operations

```js
class ColorUtils {
  // HSV to RGB conversion
  static hsvToRgb(h, s, v) {
    h = Cast.toNumber(h) % 360;
    s = Math.max(0, Math.min(1, Cast.toNumber(s)));
    v = Math.max(0, Math.min(1, Cast.toNumber(v)));
    
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    
    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }
  
  // RGB to hex conversion
  static rgbToHex(r, g, b) {
    const red = Math.max(0, Math.min(255, Math.round(Cast.toNumber(r))));
    const green = Math.max(0, Math.min(255, Math.round(Cast.toNumber(g))));
    const blue = Math.max(0, Math.min(255, Math.round(Cast.toNumber(b))));
    
    return '#' + [red, green, blue]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // Hex to RGB conversion
  static hexToRgb(hex) {
    const color = Cast.toString(hex).replace('#', '');
    if (color.length === 3) {
      return [
        parseInt(color[0] + color[0], 16),
        parseInt(color[1] + color[1], 16),
        parseInt(color[2] + color[2], 16)
      ];
    } else if (color.length === 6) {
      return [
        parseInt(color.substr(0, 2), 16),
        parseInt(color.substr(2, 2), 16),
        parseInt(color.substr(4, 2), 16)
      ];
    }
    return [0, 0, 0]; // Invalid color
  }
  
  // Color mixing
  static mixColors(color1, color2, ratio) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    const r = Cast.toNumber(ratio);
    
    const mixed = rgb1.map((c1, i) => {
      const c2 = rgb2[i];
      return Math.round(c1 * (1 - r) + c2 * r);
    });
    
    return this.rgbToHex(mixed[0], mixed[1], mixed[2]);
  }
}
```

## Variable Utilities

### Variable Management Helpers

```js
class VariableUtils {
  // Safe variable access
  static getVariable(target, name, type = '') {
    if (!target) return null;
    return target.lookupVariableByNameAndType(Cast.toString(name), type);
  }
  
  // Set variable value safely
  static setVariable(target, name, value, type = '') {
    const variable = this.getVariable(target, name, type);
    if (variable) {
      variable.value = type === 'list' ? value : Cast.toString(value);
      return true;
    }
    return false;
  }
  
  // Get variable value with default
  static getVariableValue(target, name, defaultValue = '', type = '') {
    const variable = this.getVariable(target, name, type);
    return variable ? variable.value : defaultValue;
  }
  
  // Check if variable exists
  static hasVariable(target, name, type = '') {
    return !!this.getVariable(target, name, type);
  }
  
  // List operations
  static getListItem(target, listName, index) {
    const list = this.getVariable(target, listName, 'list');
    if (!list || !Array.isArray(list.value)) return '';
    
    const idx = Cast.toNumber(index) - 1; // Convert to 0-based
    return list.value[idx] || '';
  }
  
  static setListItem(target, listName, index, value) {
    const list = this.getVariable(target, listName, 'list');
    if (!list || !Array.isArray(list.value)) return false;
    
    const idx = Cast.toNumber(index) - 1; // Convert to 0-based
    if (idx >= 0 && idx < list.value.length) {
      list.value[idx] = Cast.toString(value);
      return true;
    }
    return false;
  }
  
  static addToList(target, listName, value) {
    const list = this.getVariable(target, listName, 'list');
    if (!list) return false;
    
    if (!Array.isArray(list.value)) {
      list.value = [];
    }
    list.value.push(Cast.toString(value));
    return true;
  }
  
  static getListLength(target, listName) {
    const list = this.getVariable(target, listName, 'list');
    return list && Array.isArray(list.value) ? list.value.length : 0;
  }
}

// Extension usage
class DataExtension {
  getInfo() {
    return {
      id: 'datautils',
      name: 'Data Utils',
      blocks: [
        {
          opcode: 'getVar',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get [VAR] or [DEFAULT]',
          arguments: {
            VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'score' },
            DEFAULT: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
          }
        }
      ]
    };
  }
  
  getVar(args, util) {
    return VariableUtils.getVariableValue(
      util.target, 
      args.VAR, 
      args.DEFAULT
    );
  }
}
```

## Validation Utilities

### Input Validation

```js
class ValidationUtils {
  // Validate number range
  static isInRange(value, min, max) {
    const num = Cast.toNumber(value);
    return num >= Cast.toNumber(min) && num <= Cast.toNumber(max);
  }
  
  // Validate string length
  static isValidLength(text, minLength, maxLength) {
    const str = Cast.toString(text);
    const min = Cast.toNumber(minLength);
    const max = Cast.toNumber(maxLength);
    return str.length >= min && str.length <= max;
  }
  
  // Validate email format (basic)
  static isEmail(text) {
    const str = Cast.toString(text);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }
  
  // Validate URL format (basic)
  static isURL(text) {
    const str = Cast.toString(text);
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
  
  // Validate hex color
  static isHexColor(text) {
    const str = Cast.toString(text);
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
  }
}
```

## Array Utilities

### Array Operations

```js
class ArrayUtils {
  // Shuffle array (Fisher-Yates)
  static shuffle(array) {
    const arr = Array.isArray(array) ? [...array] : [];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  // Remove duplicates
  static unique(array) {
    return Array.isArray(array) ? [...new Set(array)] : [];
  }
  
  // Find common elements between arrays
  static intersection(arr1, arr2) {
    const a1 = Array.isArray(arr1) ? arr1 : [];
    const a2 = Array.isArray(arr2) ? arr2 : [];
    return a1.filter(x => a2.includes(x));
  }
  
  // Sort array with Scratch semantics
  static sort(array, ascending = true) {
    if (!Array.isArray(array)) return [];
    
    return [...array].sort((a, b) => {
      const comparison = Cast.compare(a, b);
      return ascending ? comparison : -comparison;
    });
  }
}
```

## Performance Utilities

### Efficient Operations

```js
class PerformanceUtils {
  // Debounce function calls
  static debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  // Throttle function calls
  static throttle(func, interval) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= interval) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }
  
  // Cache expensive computations
  static memoize(func) {
    const cache = new Map();
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }
}
```

## Usage Patterns

### Comprehensive Extension Example

```js
class UtilityExtension {
  constructor() {
    // Initialize utility instances
    this.mathUtils = new MathUtils();
    this.colorUtils = new ColorUtils();
    this.textUtils = new TextUtils();
  }
  
  getInfo() {
    return {
      id: 'utilities',
      name: 'Utilities',
      blocks: [
        {
          opcode: 'processText',
          blockType: Scratch.BlockType.REPORTER,
          text: '[OPERATION] text [TEXT]',
          arguments: {
            OPERATION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'TEXT_OPS'
            },
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello World'
            }
          }
        },
        {
          opcode: 'mathOperation',
          blockType: Scratch.BlockType.REPORTER,
          text: '[OP] [A] and [B]',
          arguments: {
            OP: {
              type: Scratch.ArgumentType.STRING,
              menu: 'MATH_OPS'
            },
            A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
          }
        }
      ],
      menus: {
        TEXT_OPS: {
          items: ['reverse', 'word count', 'capitalize', 'remove spaces']
        },
        MATH_OPS: {
          items: ['clamp between', 'distance to', 'map from']
        }
      }
    };
  }
  
  processText(args) {
    const text = Cast.toString(args.TEXT);
    
    switch (args.OPERATION) {
      case 'reverse':
        return TextUtils.reverseString(text);
      case 'word count':
        return TextUtils.countWords(text);
      case 'capitalize':
        return TextUtils.capitalizeWords(text);
      case 'remove spaces':
        return TextUtils.removeSpaces(text);
      default:
        return text;
    }
  }
  
  mathOperation(args) {
    const a = Cast.toNumber(args.A);
    const b = Cast.toNumber(args.B);
    
    switch (args.OP) {
      case 'clamp between':
        return MathUtils.clamp(a, 0, b);
      case 'distance to':
        return MathUtils.distance(0, 0, a, b);
      case 'map from':
        return MathUtils.map(a, 0, 100, 0, b);
      default:
        return a;
    }
  }
}
```

## Best Practices

1. **Always use Cast utilities** for type conversion to ensure Scratch compatibility
2. **Validate inputs** before processing to prevent runtime errors
3. **Handle edge cases** gracefully (null, undefined, empty strings)
4. **Use appropriate data types** for your extension's context
5. **Cache expensive operations** when appropriate
6. **Provide sensible defaults** for optional parameters
7. **Document utility functions** clearly for maintenance

These utility APIs provide the foundation for creating robust, reliable extensions that handle data the same way Scratch does internally, ensuring consistent behavior across all user interactions.