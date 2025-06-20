---
title: Utilities
sidebar_position: 6
---

# Utility Functions

MistWarp provides a collection of utility functions and helpers available throughout the codebase for common operations.

## Overview

Utility functions provide:
- Common data manipulation operations
- File handling and format conversion
- DOM utility functions
- Performance optimization helpers
- Validation and type checking

## File Utilities

### File Handling
Common file operations and format conversions:

```javascript
import {
  loadProject,
  saveProject,
  exportProject,
  importAssets
} from '../lib/file-utils';

// Load project from file
const project = await loadProject(file);

// Save project to blob
const blob = await saveProject(projectData, 'my-project.sb3');

// Export in different formats
const sb3Blob = await exportProject(projectData, 'sb3');
const jsonBlob = await exportProject(projectData, 'json');
```

### Asset Processing
Image and sound asset utilities:

```javascript
import {
  resizeImage,
  convertToDataURL,
  validateImageFormat,
  compressAudio
} from '../lib/asset-utils';

// Resize image to fit constraints
const resizedImage = await resizeImage(imageFile, 480, 360);

// Convert file to data URL
const dataURL = await convertToDataURL(file);

// Validate supported formats
const isValid = validateImageFormat(file.type);
```

## DOM Utilities

### Element Utilities
DOM manipulation and query helpers:

```javascript
import {
  waitForElement,
  createElement,
  addClass,
  removeClass,
  findParent
} from '../lib/dom-utils';

// Wait for element to appear
const element = await waitForElement('.target-selector');

// Create element with attributes
const button = createElement('button', {
  className: 'custom-button',
  textContent: 'Click me',
  onclick: handleClick
});

// Class manipulation
addClass(element, 'active');
removeClass(element, 'disabled');

// Find parent by selector
const container = findParent(element, '.container');
```

### Event Utilities
Event handling helpers:

```javascript
import {
  throttle,
  debounce,
  once,
  addEventListeners
} from '../lib/event-utils';

// Throttle function calls
const throttledHandler = throttle(handleScroll, 100);

// Debounce function calls
const debouncedSearch = debounce(performSearch, 300);

// Execute only once
const initHandler = once(initialize);

// Add multiple event listeners
addEventListeners(element, {
  click: handleClick,
  mouseenter: handleMouseEnter,
  mouseleave: handleMouseLeave
});
```

## Data Utilities

### Object Manipulation
Object and array processing helpers:

```javascript
import {
  deepClone,
  deepMerge,
  pick,
  omit,
  groupBy,
  unique
} from '../lib/data-utils';

// Deep clone objects
const clonedProject = deepClone(originalProject);

// Merge objects deeply
const config = deepMerge(defaultConfig, userConfig);

// Pick specific properties
const metadata = pick(project, ['title', 'author', 'version']);

// Omit properties
const publicData = omit(project, ['internalId', 'privateNotes']);

// Group array by property
const spritesByType = groupBy(sprites, 'type');

// Get unique values
const uniqueColors = unique(blocks.map(b => b.color));
```

### Validation
Type checking and validation utilities:

```javascript
import {
  isValidProject,
  isValidSprite,
  validateBlockData,
  sanitizeInput
} from '../lib/validation-utils';

// Validate project structure
if (isValidProject(projectData)) {
  console.log('Project is valid');
}

// Validate sprite data
const spriteErrors = isValidSprite(spriteData);
if (spriteErrors.length === 0) {
  console.log('Sprite is valid');
}

// Validate and sanitize user input
const safeInput = sanitizeInput(userInput);
```

## String Utilities

### Text Processing
String manipulation and formatting:

```javascript
import {
  truncate,
  slugify,
  capitalize,
  formatNumber,
  formatDuration
} from '../lib/string-utils';

// Truncate long text
const shortTitle = truncate(projectTitle, 50);

// Create URL-safe slug
const slug = slugify('My Awesome Project'); // 'my-awesome-project'

// Capitalize text
const title = capitalize('hello world'); // 'Hello World'

// Format numbers
const formattedCount = formatNumber(12345); // '12,345'

// Format duration
const duration = formatDuration(125000); // '2m 5s'
```

### Internationalization
Localization and text utilities:

```javascript
import {
  getLocale,
  formatMessage,
  pluralize,
  formatDate
} from '../lib/i18n-utils';

// Get current locale
const locale = getLocale(); // 'en-US'

// Format messages with parameters
const message = formatMessage('hello-user', { name: 'Alice' });

// Handle pluralization
const countText = pluralize(count, 'block', 'blocks');

// Format dates
const formattedDate = formatDate(new Date(), locale);
```

## Math Utilities

### Calculations
Mathematical operations and calculations:

```javascript
import {
  clamp,
  lerp,
  distance,
  angle,
  random,
  normalize
} from '../lib/math-utils';

// Clamp value to range
const clamped = clamp(value, 0, 100);

// Linear interpolation
const interpolated = lerp(start, end, 0.5);

// Distance between points
const dist = distance(x1, y1, x2, y2);

// Angle between points
const angleRad = angle(x1, y1, x2, y2);

// Random number in range
const randomValue = random(min, max);

// Normalize vector
const normalized = normalize(x, y);
```

### Color Utilities
Color manipulation and conversion:

```javascript
import {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  adjustBrightness,
  getContrastColor
} from '../lib/color-utils';

// Convert color formats
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(255, 0, 0); // '#ff0000'

// Adjust brightness
const brighter = adjustBrightness('#ff0000', 0.2);

// Get contrasting color for text
const textColor = getContrastColor('#ff0000'); // '#ffffff'
```

## Performance Utilities

### Optimization
Performance monitoring and optimization helpers:

```javascript
import {
  memoize,
  measureTime,
  raf,
  idle,
  createWorker
} from '../lib/performance-utils';

// Memoize expensive calculations
const expensiveFunction = memoize((input) => {
  // Expensive computation
  return result;
});

// Measure execution time
const result = await measureTime('operation', () => {
  // Code to measure
});

// Use requestAnimationFrame
raf(() => {
  // Animation code
});

// Use requestIdleCallback
idle(() => {
  // Background work
});

// Create web worker for heavy tasks
const worker = createWorker(workerScript);
const result = await worker.postMessage(data);
```

### Memory Management
Memory usage optimization:

```javascript
import {
  createPool,
  cleanup,
  weakRef,
  observeMemory
} from '../lib/memory-utils';

// Object pooling
const pool = createPool(() => new ExpensiveObject());
const obj = pool.acquire();
// Use object
pool.release(obj);

// Cleanup references
cleanup(obj);

// Weak references
const weakRef = createWeakRef(largeObject);

// Monitor memory usage
observeMemory((usage) => {
  console.log('Memory usage:', usage);
});
```

## Storage Utilities

### Local Storage
Browser storage helpers:

```javascript
import {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem
} from '../lib/storage-utils';

// Store data with expiration
await setItem('user-preferences', data, { expires: '7d' });

// Retrieve data
const preferences = await getItem('user-preferences');

// Check if item exists
if (await hasItem('cache-key')) {
  // Item exists
}

// Clear expired items
await clear({ onlyExpired: true });
```

## Testing Utilities

### Test Helpers
Utilities for testing components and functions:

```javascript
import {
  mockVM,
  createTestProject,
  simulateClick,
  waitForAsync,
  expectNoConsoleErrors
} from '../lib/test-utils';

// Mock VM for testing
const vm = mockVM({
  runtime: {
    targets: [],
    allTargets: []
  }
});

// Create test project
const project = createTestProject({
  sprites: 2,
  blocks: 10
});

// Simulate user interactions
await simulateClick(button);

// Wait for async operations
await waitForAsync(() => element.textContent === 'Done');

// Check for console errors
expectNoConsoleErrors();
```

## Best Practices

### Error Handling
Robust error handling in utilities:

```javascript
export function safeOperation(input) {
  try {
    return performOperation(input);
  } catch (error) {
    console.warn('Operation failed:', error);
    return fallbackValue;
  }
}
```

### Type Safety
TypeScript utilities for type checking:

```javascript
export function isString(value): value is string {
  return typeof value === 'string';
}

export function assertNumber(value): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}
```

## Related Documentation

- [Extension API Reference](./extension-api)
- [Addon API Reference](./addon-api)
- [Development Guide](../development)
