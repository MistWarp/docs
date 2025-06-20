---
title: GUI API Reference
sidebar_position: 2
---

# GUI API Reference

The MistWarp GUI provides programmatic access to interface components, themes, project management, and VM integration. This API is primarily used by extensions, addons, and advanced integrations.

## Core GUI Instance

### Window.gui

The main GUI instance is available globally as `window.gui`:

```javascript
// Access the GUI instance
const gui = window.gui;

// Check if GUI is ready
if (gui && gui.getBlockly) {
    // GUI is available
}
```

## Blockly Integration

### getBlockly()

Get access to the ScratchBlocks/Blockly workspace:

```javascript
// Get Blockly when available (lazy loading)
const blockly = await gui.getBlockly();

// Access workspace
const workspace = blockly.getMainWorkspace();
```

### getBlocklyEagerly()

Force-load Blockly immediately (resource intensive):

```javascript
// Force load Blockly (causes network activity)
const blockly = await gui.getBlocklyEagerly();
```

**Warning**: `getBlocklyEagerly()` downloads the full scratch-blocks bundle and should be used sparingly.

## Theme Management

### Theme API

Access and modify GUI themes:

```javascript
// Get current theme
const currentTheme = gui.store.getState().scratchGui.theme.theme;

// Set theme
gui.store.dispatch({
    type: 'scratch-gui/theme/SET_THEME',
    theme: 'dark'
});

// Available themes
const themes = ['light', 'dark', 'midnight'];
```

### Theme Structure

Theme objects contain GUI and block styling:

```javascript
const themeConfig = {
    gui: {
        // GUI colors
        primaryText: '#000000',
        menuBarBackground: '#ffffff',
        // ... more GUI properties
    },
    blocks: {
        // Block colors
        motion: '#4C97FF',
        looks: '#9966FF',
        // ... more block categories
    },
    accent: {
        // Accent colors for highlights
        primary: '#0FBD8C',
        secondary: '#40BF4A'
    }
};
```

### Custom Themes

Register custom themes:

```javascript
// Define custom theme
const customTheme = {
    name: 'My Theme',
    gui: guiLight, // Base GUI theme
    blocks: blocksThree, // Base block theme  
    accent: customAccent, // Custom accent colors
    id: 'custom.mytheme'
};

// Apply custom theme
gui.setCustomTheme(customTheme);
```

## Project Management

### Project State

Access project information:

```javascript
const state = gui.store.getState().scratchGui.projectState;

// Project properties
const projectId = state.projectId;
const projectTitle = state.projectTitle;
const isLoading = state.loadingState;
const hasUnsavedChanges = state.projectChanged;
```

### Project Actions

Programmatically manage projects:

```javascript
// Create new project
gui.store.dispatch({
    type: 'scratch-gui/project-state/CREATE_NEW',
    canSave: true
});

// Load project from file
const file = new File([projectData], 'project.sb3');
gui.handleFileUpload(file);

// Save project
gui.store.dispatch({
    type: 'scratch-gui/project-state/SAVE_PROJECT'
});
```

## VM Integration

### Virtual Machine Access

Access the Scratch VM instance:

```javascript
// Get VM instance
const vm = gui.store.getState().scratchGui.vm;

// VM operations
vm.greenFlag(); // Start project
vm.stopAll();   // Stop project
vm.setTurboMode(true); // Enable turbo mode

// Load project data
await vm.loadProject(projectData);
```

### Target Management

Manage sprites and stage:

```javascript
// Get targets (sprites + stage)
const targets = vm.runtime.targets;
const stage = vm.runtime.getTargetForStage();
const sprites = vm.runtime.getSpriteTargets();

// Get editing target
const editingTarget = vm.editingTarget;

// Set editing target
vm.setEditingTarget(targetId);
```

### Monitors

Control variable and list monitors:

```javascript
// Get monitors
const monitors = vm.runtime._monitorState;

// Show/hide monitor
vm.requestAddMonitor({
    id: 'variableId',
    spriteName: null, // null for global
    opcode: 'data_variable'
});

vm.requestRemoveMonitor('variableId');
```

## GUI Components

### Modal Management

Control modal dialogs:

```javascript
// Open modals
gui.store.dispatch({ type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY' });
gui.store.dispatch({ type: 'scratch-gui/modals/OPEN_COSTUME_LIBRARY' });

// Close modals
gui.store.dispatch({ type: 'scratch-gui/modals/CLOSE_EXTENSION_LIBRARY' });
gui.store.dispatch({ type: 'scratch-gui/modals/CLOSE_COSTUME_LIBRARY' });
```

### Tab Management

Switch between editor tabs:

```javascript
// Tab indices
const BLOCKS_TAB = 0;
const COSTUMES_TAB = 1; 
const SOUNDS_TAB = 2;

// Activate tab
gui.store.dispatch({
    type: 'scratch-gui/editor-tab/ACTIVATE_TAB',
    activeTabIndex: COSTUMES_TAB
});
```

### Stage Size Control

Manage stage dimensions:

```javascript
// Set stage size mode
gui.store.dispatch({
    type: 'scratch-gui/stage-size/SET_STAGE_SIZE',
    stageSize: 'large' // 'small', 'large'
});

// Custom stage size
gui.store.dispatch({
    type: 'scratch-gui/custom-stage-size/SET_CUSTOM_STAGE_SIZE',
    width: 480,
    height: 360
});
```

## Extension Integration

### Custom Extensions

Load custom extensions:

```javascript
// Load extension from URL
vm.extensionManager.loadExtensionURL('https://example.com/extension.js');

// Load extension from text
vm.extensionManager.loadExtensionFromText(extensionCode, 'extensionName');
```

### Extension Library

Manage extension library visibility:

```javascript
// Show extension library
gui.store.dispatch({
    type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY'
});

// Handle extension selection
const handleExtensionSelect = (extensionId) => {
    vm.extensionManager.loadExtensionIdSync(extensionId);
};
```

## Event Handling

### GUI Events

Listen to GUI state changes:

```javascript
// Subscribe to store changes
const unsubscribe = gui.store.subscribe(() => {
    const state = gui.store.getState();
    // Handle state changes
});

// Unsubscribe when done
unsubscribe();
```

### VM Events

Listen to VM events:

```javascript
// Project events
vm.on('PROJECT_LOADED', () => {
    console.log('Project loaded');
});

vm.on('PROJECT_CHANGED', () => {
    console.log('Project modified');
});

// Target events  
vm.on('targetsUpdate', (data) => {
    console.log('Targets updated:', data.targetList);
});

// Monitor events
vm.on('MONITORS_UPDATE', (monitors) => {
    console.log('Monitors updated:', monitors);
});
```

## Asset Management

### Costume Operations

Manage sprite costumes:

```javascript
// Add costume to target
vm.addCostume(costumeId, costume, targetId);

// Delete costume
vm.deleteCostume(costumeId);

// Set active costume
vm.setActiveCostume(targetId, costumeId);
```

### Sound Operations

Manage sprite sounds:

```javascript
// Add sound to target
vm.addSound(sound, targetId);

// Delete sound
vm.deleteSound(soundId);

// Play sound
vm.runtime.audioEngine.playSound(sound);
```

## Performance Monitoring

### Metrics Access

Access performance data:

```javascript
// Runtime metrics
const metrics = vm.runtime.stats;
console.log('FPS:', metrics.fps);
console.log('Frame count:', metrics.frameCount);

// Workspace metrics
const workspaceMetrics = gui.store.getState().scratchGui.workspaceMetrics;
```

### Memory Usage

Monitor memory consumption:

```javascript
// Check memory usage
if (performance.memory) {
    console.log('Used heap:', performance.memory.usedJSHeapSize);
    console.log('Total heap:', performance.memory.totalJSHeapSize);
}
```

## Error Handling

### Error Boundaries

Handle GUI errors:

```javascript
// Set up error handling
window.addEventListener('error', (event) => {
    console.error('GUI Error:', event.error);
});

// React error boundary
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise:', event.reason);
});
```

### VM Error Handling

Handle VM runtime errors:

```javascript
vm.on('RUNTIME_ERROR', (error) => {
    console.error('VM Runtime Error:', error);
});

vm.on('COMPILE_ERROR', (error) => {
    console.error('VM Compile Error:', error);  
});
```

## Development Tools

### Debug Utilities

Access debugging features:

```javascript
// Enable debug mode
window.DEBUG = true;

// Access internal components
window._gui = gui;
window._vm = vm;
window._blockly = blockly;

// Performance profiling
window.guiProfiler = {
    startProfile: () => performance.mark('profile-start'),
    endProfile: () => {
        performance.mark('profile-end');
        performance.measure('profile', 'profile-start', 'profile-end');
    }
};
```

### Redux DevTools

When Redux DevTools are available:

```javascript
// Access Redux DevTools
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
if (devTools) {
    // DevTools are available
    console.log('Redux DevTools detected');
}
```

## Type Definitions

For TypeScript users:

```typescript
interface GUIInstance {
    store: ReduxStore;
    getBlockly(): Promise<ScratchBlocks>;
    getBlocklyEagerly(): Promise<ScratchBlocks>;
    handleFileUpload(file: File): void;
    setCustomTheme(theme: ThemeConfig): void;
}

interface ThemeConfig {
    name: string;
    gui: GUITheme;
    blocks: BlockTheme;
    accent: AccentTheme;
    id: string;
}

interface VMInstance {
    runtime: Runtime;
    editingTarget: Target;
    greenFlag(): void;
    stopAll(): void;
    loadProject(data: ArrayBuffer): Promise<void>;
    setTurboMode(enabled: boolean): void;
}
```

This API provides comprehensive access to MistWarp's GUI functionality while maintaining compatibility with the underlying Scratch architecture.
