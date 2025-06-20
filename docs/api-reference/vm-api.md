# VM API Reference

The MistWarp Virtual Machine API provides programmatic access to the Scratch runtime environment.

## Overview

The VM API allows external code to:
- Control project execution (start, stop, step)
- Access and modify project data
- Listen for runtime events
- Manage sprites and their properties
- Control stage and rendering

## Getting the VM Instance

```javascript
// In browser environment
const vm = window.vm; // Global VM instance

// In extension/addon context
const vm = addon.api.vm;

// From Redux store
import { useSelector } from 'react-redux';
const vm = useSelector(state => state.vm.instance);
```

## Core Methods

### Project Control

#### `vm.start()`
Start project execution.

```javascript
vm.start();
// Equivalent to clicking the green flag
```

#### `vm.stop()`
Stop project execution.

```javascript
vm.stop();
// Equivalent to clicking the stop button
```

#### `vm.greenFlag()`
Trigger green flag event.

```javascript
vm.greenFlag();
// Starts project and triggers "when green flag clicked" blocks
```

#### `vm.stopAll()`
Stop all scripts and sounds.

```javascript
vm.stopAll();
// Stops all running scripts and sounds
```

### Project Loading

#### `vm.loadProject(projectData)`
Load a project from data.

```javascript
// Load from .sb3 file data
const fileData = await file.arrayBuffer();
await vm.loadProject(fileData);

// Load from JSON
const projectJson = { /* project data */ };
await vm.loadProject(JSON.stringify(projectJson));
```

**Parameters:**
- `projectData` (ArrayBuffer | string): Project data in .sb3 format or JSON string

**Returns:** Promise that resolves when project is loaded

#### `vm.saveProjectSb3()`
Export current project as .sb3 data.

```javascript
const projectData = await vm.saveProjectSb3();
// Returns ArrayBuffer that can be saved as .sb3 file

// Save to file
const blob = new Blob([projectData], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'project.sb3';
a.click();
```

**Returns:** `Promise&lt;ArrayBuffer&gt;` containing .sb3 project data

### Target Management

#### `vm.getTargets()`
Get all targets (sprites and stage).

```javascript
const targets = vm.getTargets();
console.log('Sprites:', targets.filter(t => !t.isStage));
console.log('Stage:', targets.find(t => t.isStage));
```

**Returns:** Array of target objects

#### `vm.getEditingTarget()`
Get currently selected sprite/stage.

```javascript
const target = vm.getEditingTarget();
console.log('Currently editing:', target.getName());
```

**Returns:** Target object or null

#### `vm.setEditingTarget(targetId)`
Set the editing target.

```javascript
const sprite = vm.getTargets().find(t => t.getName() === 'Misty');
vm.setEditingTarget(sprite.id);
```

**Parameters:**
- `targetId` (string): ID of target to select

### Runtime Information

#### `vm.getPlaygroundData()`
Get current runtime state.

```javascript
const data = vm.getPlaygroundData();
console.log('Targets:', data.targets);
console.log('Variables:', data.variables);
console.log('Lists:', data.lists);
```

**Returns:** Object containing runtime state

#### `vm.getMonitorState()`
Get monitor (variable display) state.

```javascript
const monitors = vm.getMonitorState();
console.log('Visible monitors:', monitors);
```

**Returns:** Object mapping monitor IDs to their state

## Target API

Target objects represent sprites and the stage.

### Target Properties

```javascript
const target = vm.getEditingTarget();

// Basic properties
console.log(target.id);        // Unique identifier
console.log(target.getName()); // Display name
console.log(target.isStage);   // true for stage, false for sprites

// Position and appearance (sprites only)
if (!target.isStage) {
  console.log(target.x);         // X position
  console.log(target.y);         // Y position
  console.log(target.direction); // Direction (0-359)
  console.log(target.size);      // Size percentage
  console.log(target.visible);   // Visibility
}

// Costumes and sounds
console.log(target.getCostumes());
console.log(target.getSounds());
console.log(target.getCurrentCostume());
```

### Target Methods

#### `target.setXY(x, y)`
Set sprite position.

```javascript
const sprite = vm.getEditingTarget();
sprite.setXY(100, 50);
```

#### `target.setDirection(direction)`
Set sprite direction.

```javascript
sprite.setDirection(90); // Point right
```

#### `target.setSize(size)`
Set sprite size.

```javascript
sprite.setSize(150); // 150% of original size
```

#### `target.setVisible(visible)`
Set sprite visibility.

```javascript
sprite.setVisible(false); // Hide sprite
```

#### `target.goToFront()`
Move sprite to front layer.

```javascript
sprite.goToFront();
```

#### `target.goToBack()`
Move sprite to back layer.

```javascript
sprite.goToBack();
```

## Event System

The VM emits events that can be listened to.

### Core Events

#### `PROJECT_LOADED`
Fired when a project is loaded.

```javascript
vm.on('PROJECT_LOADED', () => {
  console.log('Project loaded successfully');
});
```

#### `PROJECT_CHANGED`
Fired when project is modified.

```javascript
vm.on('PROJECT_CHANGED', () => {
  console.log('Project has unsaved changes');
});
```

#### `TARGETS_UPDATE`
Fired when targets (sprites) are modified.

```javascript
vm.on('TARGETS_UPDATE', (targets) => {
  console.log('Targets updated:', targets);
});
```

#### `VISUAL_REPORT`
Fired on each frame for visual updates.

```javascript
vm.on('VISUAL_REPORT', (data) => {
  // Update custom renderer
  updateCustomStage(data);
});
```

#### `MONITORS_UPDATE`
Fired when variable monitors update.

```javascript
vm.on('MONITORS_UPDATE', (monitors) => {
  updateVariableDisplays(monitors);
});
```

### Runtime Events

#### `PROJECT_RUN_START`
Project starts running.

```javascript
vm.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});
```

#### `PROJECT_RUN_STOP`
Project stops running.

```javascript
vm.on('PROJECT_RUN_STOP', () => {
  console.log('Project stopped');
});
```

#### `SCRIPT_ERROR`
Script execution error occurs.

```javascript
vm.on('SCRIPT_ERROR', (error) => {
  console.error('Script error:', error);
});
```

## Variable Management

### Getting Variables

```javascript
// Get all variables for a target
const variables = target.getAllVariableNamesInScopeForTarget();

// Get variable value
const value = target.lookupVariableByNameAndType('my variable', 'variable');
console.log('Variable value:', value.value);
```

### Setting Variables

```javascript
// Set variable value
const variable = target.lookupVariableByNameAndType('score', 'variable');
if (variable) {
  variable.value = 100;
}
```

### Creating Variables

```javascript
// Create new variable
vm.createVariable('new variable', 'variable', target.id);
```

## Block Management

### Getting Blocks

```javascript
// Get all blocks for target
const blocks = target.blocks;

// Get specific block
const block = blocks.getBlock(blockId);
console.log('Block opcode:', block.opcode);
console.log('Block inputs:', block.inputs);
```

### Running Blocks

```javascript
// Execute a specific block
vm.runtime.sequencer.stepThread({
  target: target,
  topBlock: blockId,
  isCompiled: false
});
```

## Extension API

For extension development within the VM.

### Extension Registration

```javascript
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: 'My Extension',
      blocks: [
        {
          opcode: 'myBlock',
          blockType: 'command',
          text: 'do something'
        }
      ]
    };
  }
  
  myBlock() {
    console.log('My block executed!');
  }
}

// Register extension
vm.extensionManager.loadExtensionURL('myextension', MyExtension);
```

### Custom Blocks

```javascript
// Define custom block
{
  opcode: 'customCommand',
  blockType: 'command',
  text: 'custom command with [TEXT] and [NUMBER]',
  arguments: {
    TEXT: {
      type: 'string',
      defaultValue: 'hello'
    },
    NUMBER: {
      type: 'number',
      defaultValue: 10
    }
  }
}

// Implement block function
customCommand(args) {
  console.log('Text:', args.TEXT);
  console.log('Number:', args.NUMBER);
}
```

## Performance Monitoring

### Frame Rate

```javascript
let frameCount = 0;
let lastTime = performance.now();

vm.on('VISUAL_REPORT', () => {
  frameCount++;
  const now = performance.now();
  
  if (now - lastTime >= 1000) {
    const fps = frameCount;
    console.log('FPS:', fps);
    frameCount = 0;
    lastTime = now;
  }
});
```

### Script Performance

```javascript
// Monitor script execution time
vm.runtime.on('BEFORE_EXECUTE', (thread) => {
  thread._startTime = performance.now();
});

vm.runtime.on('AFTER_EXECUTE', (thread) => {
  const duration = performance.now() - thread._startTime;
  if (duration > 16) { // Longer than one frame
    console.warn('Slow script:', thread.topBlock, duration + 'ms');
  }
});
```

## Error Handling

### Catching VM Errors

```javascript
vm.on('ERROR', (error) => {
  console.error('VM Error:', error);
  
  // Handle different error types
  switch (error.type) {
    case 'SCRIPT_ERROR':
      handleScriptError(error);
      break;
    case 'LOAD_ERROR':
      handleLoadError(error);
      break;
    default:
      handleGenericError(error);
  }
});
```

### Graceful Degradation

```javascript
try {
  await vm.loadProject(projectData);
} catch (error) {
  console.error('Failed to load project:', error);
  
  // Fall back to empty project
  await vm.loadProject(getEmptyProject());
  
  // Show user-friendly error
  showErrorMessage('Could not load project. Started with empty project.');
}
```

## Best Practices

### Memory Management

```javascript
// Clean up event listeners
const cleanup = () => {
  vm.off('PROJECT_LOADED', handleProjectLoaded);
  vm.off('TARGETS_UPDATE', handleTargetsUpdate);
};

// Call cleanup when component unmounts
useEffect(() => cleanup, []);
```

### Performance

```javascript
// Debounce frequent operations
const debouncedSave = debounce(() => {
  saveProject();
}, 1000);

vm.on('PROJECT_CHANGED', debouncedSave);
```

### Error Recovery

```javascript
// Implement retry logic for critical operations
const loadProjectWithRetry = async (data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await vm.loadProject(data);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

## Related Documentation

- [GUI API Reference](gui-api)
- [Extension API Reference](extension-api)
- [Event System](events)
