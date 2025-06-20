---
title: JavaScript Integration
sidebar_position: 8
---

# JavaScript Integration

MistWarp provides powerful JavaScript integration capabilities that allow you to extend projects with custom code, interact with web APIs, and create sophisticated applications beyond what's possible with blocks alone.

## Understanding JavaScript in MistWarp

### What is JavaScript Integration?
JavaScript integration allows you to:
- **Execute Custom Code**: Run JavaScript alongside block scripts
- **Access Web APIs**: Use browser APIs for advanced functionality
- **External Libraries**: Include popular JavaScript libraries
- **DOM Manipulation**: Interact with the webpage
- **Real-time Communication**: WebSockets, API calls, and more

### Security Model
MistWarp runs JavaScript in different security contexts:
- **Sandboxed**: Safe, limited access (default)
- **Unsandboxed**: Full access, requires user permission
- **Extension Context**: Special privileges for extensions

## Enabling JavaScript

### Via Interface
1. Click the **Advanced** button in the editor
2. Enable **Allow custom JavaScript**
3. Accept security warning
4. JavaScript blocks become available

### Via URL Parameter
```
https://warp.mistium.com/?unsafe
```

:::warning Security Notice
Custom JavaScript can access your computer and personal data. Only enable it for projects you trust.
:::

## JavaScript Blocks

### Basic JavaScript Block
Execute custom JavaScript code:

```scratch
run js [
  console.log("Hello from MistWarp!");
  return 42;
] // Returns: 42
```

### JavaScript Function Block
Create reusable JavaScript functions:

```scratch
define js function [factorial] with parameters [n]
[
  function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
  }
  return factorial(n);
]

// Usage
set [result v] to (call js function [factorial] with [5]) // Returns: 120
```

### Asynchronous JavaScript
Handle promises and async operations:

```scratch
run js async [
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data.value;
]
```

## Interacting with Scratch

### Accessing Variables
Read and modify Scratch variables from JavaScript:

```javascript
// Get variable value
const score = vm.runtime.getTargetForStage().variables[variableId].value;

// Set variable value
vm.runtime.getTargetForStage().variables[variableId].value = 100;

// Get variable by name
const scoreVar = vm.runtime.getTargetForStage().lookupVariableByNameAndType('score', '');
scoreVar.value = 200;
```

### Controlling Sprites
Manipulate sprites programmatically:

```javascript
// Get current sprite
const sprite = vm.runtime.getEditingTarget();

// Change position
sprite.setXY(100, 50);

// Change costume
sprite.setCostume(0);

// Change size
sprite.setSize(150);

// Set rotation
sprite.setDirection(90);
```

### Broadcasting Events
Trigger Scratch broadcasts from JavaScript:

```javascript
// Simple broadcast
vm.runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'my_event'
});

// Broadcast with data
vm.runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'data_received',
  data: { score: 100, level: 5 }
});
```

## Web API Integration

### Fetch API
Make HTTP requests:

```javascript
// GET request
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);

// POST request
const response = await fetch('https://api.example.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', score: 100 })
});
```

### Local Storage
Persist data across sessions:

```javascript
// Save data
localStorage.setItem('gameData', JSON.stringify({
  highScore: 1000,
  playerName: 'Alice',
  level: 5
}));

// Load data
const gameData = JSON.parse(localStorage.getItem('gameData') || '{}');
const highScore = gameData.highScore || 0;
```

### Geolocation
Access user location:

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Location: ${lat}, ${lon}`);
  },
  (error) => {
    console.error('Location access denied:', error);
  }
);
```

### Camera and Microphone
Access media devices:

```javascript
// Get camera stream
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
const video = document.createElement('video');
video.srcObject = stream;
video.play();

// Get microphone stream
const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

## External Libraries

### Including Libraries
Add external JavaScript libraries:

```javascript
// Load library dynamically
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

// Wait for library to load
script.onload = () => {
  // Library is now available
  const chart = new Chart(ctx, config);
};
```

### Popular Libraries

#### Chart.js for Data Visualization
```javascript
// Create a chart
const ctx = document.createElement('canvas').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      data: [12, 19, 3],
      backgroundColor: ['red', 'blue', 'yellow']
    }]
  }
});
```

#### Three.js for 3D Graphics
```javascript
// Create 3D scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Add to page
document.body.appendChild(renderer.domElement);
```

#### Socket.io for Real-time Communication
```javascript
// Connect to WebSocket server
const socket = io('https://your-server.com');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('gameUpdate', (data) => {
  // Handle real-time game updates
  updateGameState(data);
});
```

## Advanced Patterns

### Custom Extensions
Create project-specific extensions:

```javascript
class MyCustomExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: 'My Custom Extension',
      blocks: [
        {
          opcode: 'customBlock',
          blockType: 'reporter',
          text: 'custom calculation [NUM]',
          arguments: {
            NUM: { type: 'number', defaultValue: 10 }
          }
        }
      ]
    };
  }

  customBlock(args) {
    return Math.pow(args.NUM, 2) + 1;
  }
}

// Register extension
vm.extensionManager.loadExtensionIdSync('myextension', MyCustomExtension);
```

### Event System
Create custom event systems:

```javascript
class EventManager {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

const events = new EventManager();

// Usage in Scratch
events.on('scoreUpdate', (score) => {
  vm.runtime.getTargetForStage().lookupVariableByNameAndType('score', '').value = score;
});
```

### Performance Monitoring
Monitor project performance:

```javascript
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.frameCount = 0;
  }

  measureFrame() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    
    if (elapsed >= 1000) {
      const fps = this.frameCount / (elapsed / 1000);
      console.log(`FPS: ${fps.toFixed(1)}`);
      
      this.frameCount = 0;
      this.startTime = currentTime;
    }
  }
}

const monitor = new PerformanceMonitor();
vm.runtime.on('PROJECT_RUN_START', () => {
  monitor.measureFrame();
});
```

## Integration Patterns

### Block-JavaScript Bridge
Create seamless integration between blocks and JavaScript:

```javascript
// Create bridge object
window.ScratchBridge = {
  // Call from blocks: (call js function [bridge.calculate] with [10])
  calculate: (input) => {
    return Math.complex.calculation(input);
  },
  
  // Call from blocks: (call js function [bridge.saveData] with [data])
  saveData: (data) => {
    localStorage.setItem('projectData', JSON.stringify(data));
    return 'saved';
  },
  
  // Call from blocks: (call js function [bridge.loadData])
  loadData: () => {
    return JSON.parse(localStorage.getItem('projectData') || '{}');
  }
};
```

### State Synchronization
Keep JavaScript and Scratch state synchronized:

```javascript
class StateSynchronizer {
  constructor(vm) {
    this.vm = vm;
    this.jsState = {};
    this.setupWatchers();
  }

  setupWatchers() {
    // Watch Scratch variables
    this.vm.runtime.on('VARIABLE_CHANGED', (variable) => {
      this.jsState[variable.name] = variable.value;
      this.onStateChange(variable.name, variable.value);
    });
  }

  updateScratchVariable(name, value) {
    const variable = this.vm.runtime.getTargetForStage()
      .lookupVariableByNameAndType(name, '');
    if (variable) {
      variable.value = value;
    }
  }

  onStateChange(name, value) {
    // Custom logic when state changes
    console.log(`${name} changed to ${value}`);
  }
}
```

## Security Best Practices

### Input Validation
Always validate data from external sources:

```javascript
function validateInput(input) {
  // Check type
  if (typeof input !== 'string') return false;
  
  // Check length
  if (input.length > 1000) return false;
  
  // Check for dangerous patterns
  if (/<script|javascript:|data:/i.test(input)) return false;
  
  return true;
}
```

### Sanitization
Sanitize data before using it:

```javascript
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### Error Handling
Implement robust error handling:

```javascript
try {
  const result = riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  return 'Error occurred';
}
```

## Debugging JavaScript

### Console Logging
Use console methods for debugging:

```javascript
console.log('Debug info:', data);
console.warn('Warning message');
console.error('Error occurred');
console.table(arrayData);
```

### Browser Developer Tools
- **F12**: Open developer tools
- **Console Tab**: View logs and execute code
- **Sources Tab**: Set breakpoints and debug
- **Network Tab**: Monitor API calls

### Performance Profiling
Profile JavaScript performance:

```javascript
console.time('operation');
// Your code here
console.timeEnd('operation');
```

JavaScript integration in MistWarp opens up unlimited possibilities for creating sophisticated, interactive projects. Use these features responsibly and always consider security implications when working with custom code!
