---
name: Renderer
---

# Renderer API

The scratch-render library provides a powerful WebGL-based rendering system for displaying sprites, costumes, and custom graphics in Scratch extensions. This guide explains how to integrate visual elements and custom rendering into your Scratch extensions.

## Overview for Extension Developers

When developing Scratch extensions with visual components, you'll interact with the rendering system through the runtime's renderer. The runtime provides:

- **Renderer Access** - Available via `util.runtime.renderer`
- **Drawable Management** - Create and control visual objects
- **Skin System** - Handle textures, SVGs, and custom graphics
- **Effect Pipeline** - Apply visual effects (ghost, brightness, color)
- **Custom Rendering** - Draw custom shapes and graphics

## Extension Rendering Architecture

```
Your Extension
├── Runtime Renderer (util.runtime.renderer)
├── Drawables (visual objects with position, size, effects)
├── Skins (textures, SVGs, bitmap data)
├── Effect Chain (visual effects processing)
└── Custom Render Functions (for specialized graphics)
```

## Accessing the Renderer in Extensions

### Getting the Renderer

```javascript
class MyVisualExtension {
  getInfo() {
    return {
      id: 'myVisualExtension',
      name: 'My Visual Extension',
      blocks: [
        {
          opcode: 'createCustomSprite',
          blockType: BlockType.COMMAND,
          text: 'create custom sprite with [IMAGE]'
        }
      ]
    };
  }

  createCustomSprite(args, util) {
    // Access the renderer through the runtime
    const renderer = util.runtime.renderer;
    
    if (!renderer) {
      console.warn('Renderer not available');
      return;
    }

    // Your rendering code here...
  }
}
```

## Working with Drawables

Drawables are the fundamental visual objects in the renderer. Each sprite, custom graphic, or visual element is represented as a drawable.

### Creating Custom Drawables

```javascript
class CustomGraphicsExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customDrawables = new Map(); // Track our custom drawables
  }

  createDrawable(args, util) {
    const renderer = util.runtime.renderer;
    
    // Create a new drawable
    const drawableID = renderer.createDrawable('background'); // or 'foreground'
    
    // Store reference for later manipulation
    const name = args.NAME || `drawable_${drawableID}`;
    this.customDrawables.set(name, drawableID);
    
    // Set initial properties
    renderer.updateDrawableProperties(drawableID, {
      position: [0, 0, 0], // x, y, z
      direction: 90,
      scale: [100, 100], // x scale, y scale
      visible: true
    });
    
    return name;
  }

  moveDrawable(args, util) {
    const name = args.DRAWABLE_NAME;
    const x = parseFloat(args.X) || 0;
    const y = parseFloat(args.Y) || 0;
    
    const drawableID = this.customDrawables.get(name);
    if (drawableID !== undefined) {
      const renderer = util.runtime.renderer;
      renderer.updateDrawableProperties(drawableID, {
        position: [x, y, 0]
      });
    }
  }

  hideDrawable(args, util) {
    const name = args.DRAWABLE_NAME;
    const drawableID = this.customDrawables.get(name);
    
    if (drawableID !== undefined) {
      const renderer = util.runtime.renderer;
      renderer.updateDrawableProperties(drawableID, {
        visible: false
      });
    }
  }

  removeDrawable(args, util) {
    const name = args.DRAWABLE_NAME;
    const drawableID = this.customDrawables.get(name);
    
    if (drawableID !== undefined) {
      const renderer = util.runtime.renderer;
      renderer.destroyDrawable(drawableID);
      this.customDrawables.delete(name);
    }
  }
}
```

## Working with Skins

Skins provide the visual appearance (textures, colors, shapes) for drawables. You can create custom skins from images, SVGs, or procedural graphics.

### Creating Bitmap Skins from Images

```javascript
class ImageExtension {
  async loadImageAsSkin(args, util) {
    const imageUrl = args.IMAGE_URL;
    const renderer = util.runtime.renderer;
    
    try {
      // Load image data
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      
      // Create a bitmap skin
      const skinId = renderer.createBitmapSkin(imageBitmap, 1); // 1 = default resolution
      
      // Store the skin for later use
      const skinName = args.SKIN_NAME || `skin_${skinId}`;
      this.skins.set(skinName, skinId);
      
      return skinName;
    } catch (error) {
      console.error('Failed to load image as skin:', error);
      return '';
    }
  }

  applySkinToDrawable(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const skinName = args.SKIN_NAME;
    
    const drawableID = this.customDrawables.get(drawableName);
    const skinId = this.skins.get(skinName);
    
    if (drawableID !== undefined && skinId !== undefined) {
      const renderer = util.runtime.renderer;
      renderer.updateDrawableSkinId(drawableID, skinId);
    }
  }
}
```

### Creating SVG Skins

```javascript
class SVGExtension {
  createSVGSkin(args, util) {
    const svgString = args.SVG_CODE;
    const renderer = util.runtime.renderer;
    
    try {
      // Create SVG skin from string
      const skinId = renderer.createSVGSkin(svgString, [240, 180]); // center point
      
      const skinName = args.SKIN_NAME || `svg_skin_${skinId}`;
      this.skins.set(skinName, skinId);
      
      return skinName;
    } catch (error) {
      console.error('Failed to create SVG skin:', error);
      return '';
    }
  }

  createSimpleShapeSVG(args, util) {
    const shape = args.SHAPE; // 'circle', 'square', 'triangle'
    const color = args.COLOR || '#ff0000';
    const size = parseInt(args.SIZE) || 50;
    
    let svgString = '';
    
    switch (shape) {
      case 'circle':
        svgString = `
          <svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size}" cy="${size}" r="${size}" fill="${color}" />
          </svg>
        `;
        break;
      case 'square':
        svgString = `
          <svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${size * 2}" height="${size * 2}" fill="${color}" />
          </svg>
        `;
        break;
      case 'triangle':
        svgString = `
          <svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
            <polygon points="${size},0 ${size * 2},${size * 2} 0,${size * 2}" fill="${color}" />
          </svg>
        `;
        break;
    }
    
    if (svgString) {
      return this.createSVGSkin({ SVG_CODE: svgString, SKIN_NAME: args.SKIN_NAME }, util);
    }
    
    return '';
  }
}
```

## Visual Effects in Extensions

### Applying Effects to Drawables

```javascript
class EffectsExtension {
  setDrawableEffect(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const effect = args.EFFECT; // 'ghost', 'brightness', 'color'
    const value = parseFloat(args.VALUE);
    
    const drawableID = this.customDrawables.get(drawableName);
    if (drawableID !== undefined) {
      const renderer = util.runtime.renderer;
      
      // Create effect object
      const effects = {};
      effects[effect] = value;
      
      // Apply effect to drawable
      renderer.updateDrawableProperties(drawableID, { effects });
    }
  }

  setGhostEffect(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const transparency = Math.max(0, Math.min(100, parseFloat(args.TRANSPARENCY)));
    
    this.setDrawableEffect({
      DRAWABLE_NAME: drawableName,
      EFFECT: 'ghost',
      VALUE: transparency
    }, util);
  }

  setBrightnessEffect(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const brightness = parseFloat(args.BRIGHTNESS); // -100 to 100
    
    this.setDrawableEffect({
      DRAWABLE_NAME: drawableName,
      EFFECT: 'brightness',
      VALUE: brightness
    }, util);
  }

  setColorEffect(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const colorShift = parseFloat(args.COLOR_SHIFT); // 0 to 200
    
    this.setDrawableEffect({
      DRAWABLE_NAME: drawableName,
      EFFECT: 'color',
      VALUE: colorShift
    }, util);
  }

  clearEffects(args, util) {
    const drawableName = args.DRAWABLE_NAME;
    const drawableID = this.customDrawables.get(drawableName);
    
    if (drawableID !== undefined) {
      const renderer = util.runtime.renderer;
      renderer.updateDrawableProperties(drawableID, {
        effects: {
          ghost: 0,
          brightness: 0,
          color: 0
        }
      });
    }
  }
}
```

## Advanced Rendering Techniques

### Creating Dynamic Textures

```javascript
class DynamicTextureExtension {
  createCanvasTexture(args, util) {
    const width = parseInt(args.WIDTH) || 100;
    const height = parseInt(args.HEIGHT) || 100;
    const renderer = util.runtime.renderer;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Draw something on the canvas
    ctx.fillStyle = args.BACKGROUND_COLOR || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Add some dynamic content
    ctx.fillStyle = args.TEXT_COLOR || '#000000';
    ctx.font = `${args.FONT_SIZE || 16}px Arial`;
    ctx.fillText(args.TEXT || 'Hello!', 10, 30);
    
    // Convert canvas to bitmap and create skin
    const imageData = ctx.getImageData(0, 0, width, height);
    const skinId = renderer.createBitmapSkin(imageData, 1);
    
    const skinName = args.SKIN_NAME || `canvas_skin_${skinId}`;
    this.skins.set(skinName, skinId);
    
    return skinName;
  }

  updateCanvasTexture(args, util) {
    const skinName = args.SKIN_NAME;
    const newText = args.NEW_TEXT;
    
    // Re-create the texture with updated content
    return this.createCanvasTexture({
      ...args,
      TEXT: newText,
      SKIN_NAME: skinName
    }, util);
  }
}
```

### Pen Layer Integration

```javascript
class CustomPenExtension {
  drawLineOnPenLayer(args, util) {
    const renderer = util.runtime.renderer;
    const x1 = parseFloat(args.X1);
    const y1 = parseFloat(args.Y1);
    const x2 = parseFloat(args.X2);
    const y2 = parseFloat(args.Y2);
    const color = args.COLOR || '#000000';
    const width = parseFloat(args.WIDTH) || 1;
    
    // Get the pen layer (usually a special skin for drawing)
    const penSkinId = renderer.penSkinId;
    
    if (penSkinId) {
      // Draw a line on the pen layer
      renderer.penLine(penSkinId, {
        color4f: this.hexToColor4f(color),
        diameter: width
      }, x1, y1, x2, y2);
    }
  }

  clearPenLayer(args, util) {
    const renderer = util.runtime.renderer;
    const penSkinId = renderer.penSkinId;
    
    if (penSkinId) {
      renderer.penClear(penSkinId);
    }
  }

  hexToColor4f(hex) {
    // Convert hex color to normalized RGBA array
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;
    return [r, g, b, 1.0];
  }
}
```

## Working with Sprites and Targets

### Accessing Sprite Drawables

```javascript
class SpriteInteractionExtension {
  getSpriteDrawable(args, util) {
    const target = util.target;
    const renderer = util.runtime.renderer;
    
    // Get the drawable ID for the current target
    const drawableID = target.drawableID;
    
    if (drawableID !== undefined) {
      // You can now manipulate the sprite's drawable
      return drawableID;
    }
    
    return null;
  }

  applySpriteEffect(args, util) {
    const effect = args.EFFECT;
    const value = parseFloat(args.VALUE);
    const target = util.target;
    const renderer = util.runtime.renderer;
    
    if (target.drawableID !== undefined) {
      const effects = {};
      effects[effect] = value;
      
      renderer.updateDrawableProperties(target.drawableID, { effects });
    }
  }

  cloneCurrentSprite(args, util) {
    const target = util.target;
    const renderer = util.runtime.renderer;
    
    if (target.drawableID !== undefined) {
      // Create a new drawable based on the current sprite
      const newDrawableID = renderer.createDrawable('foreground');
      
      // Copy the skin from the original sprite
      const originalSkinId = target.currentCostume?.skinId;
      if (originalSkinId) {
        renderer.updateDrawableSkinId(newDrawableID, originalSkinId);
      }
      
      // Copy position and other properties
      renderer.updateDrawableProperties(newDrawableID, {
        position: [target.x, target.y, 0],
        direction: target.direction,
        scale: [target.size, target.size],
        visible: target.visible
      });
      
      // Store the clone
      const cloneName = args.CLONE_NAME || `clone_${newDrawableID}`;
      this.customDrawables.set(cloneName, newDrawableID);
      
      return cloneName;
    }
    
    return '';
  }
}
```

## Costume and Asset Management

### Loading Custom Costumes

```javascript
class CostumeExtension {
  async addCostumeFromUrl(args, util) {
    const url = args.COSTUME_URL;
    const costumeName = args.COSTUME_NAME;
    const target = util.target;
    const renderer = util.runtime.renderer;
    
    try {
      // Load the image
      const response = await fetch(url);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      
      // Create a skin for the costume
      const skinId = renderer.createBitmapSkin(imageBitmap, 1);
      
      // Create costume object
      const costume = {
        name: costumeName,
        skinId: skinId,
        bitmapResolution: 1,
        rotationCenterX: imageBitmap.width / 2,
        rotationCenterY: imageBitmap.height / 2
      };
      
      // Add to sprite's costumes
      target.sprite.costumes.push(costume);
      
      return costume;
    } catch (error) {
      console.error('Failed to add costume from URL:', error);
      return null;
    }
  }

  switchToCostume(args, util) {
    const costumeName = args.COSTUME_NAME;
    const target = util.target;
    const renderer = util.runtime.renderer;
    
    // Find costume by name
    const costume = target.sprite.costumes.find(c => c.name === costumeName);
    
    if (costume) {
      // Update the target's current costume
      target.currentCostume = target.sprite.costumes.indexOf(costume);
      
      // Update the drawable's skin
      if (target.drawableID !== undefined) {
        renderer.updateDrawableSkinId(target.drawableID, costume.skinId);
      }
    }
  }
}
```

## Extension Block Definitions

### Complete Block Definitions for Visual Extensions

```javascript
class CompleteVisualExtension {
  getInfo() {
    return {
      id: 'visualExtension',
      name: 'Visual Extension',
      color1: '#FF6680',
      color2: '#FF4D6A',
      blocks: [
        {
          opcode: 'createDrawable',
          blockType: BlockType.REPORTER,
          text: 'create drawable named [NAME]',
          arguments: {
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'myDrawable'
            }
          }
        },
        {
          opcode: 'moveDrawable',
          blockType: BlockType.COMMAND,
          text: 'move [DRAWABLE] to x: [X] y: [Y]',
          arguments: {
            DRAWABLE: {
              type: ArgumentType.STRING,
              defaultValue: 'myDrawable'
            },
            X: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            Y: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'setDrawableEffect',
          blockType: BlockType.COMMAND,
          text: 'set [DRAWABLE] [EFFECT] to [VALUE]',
          arguments: {
            DRAWABLE: {
              type: ArgumentType.STRING,
              defaultValue: 'myDrawable'
            },
            EFFECT: {
              type: ArgumentType.STRING,
              menu: 'effectMenu'
            },
            VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        '---', // Separator
        {
          opcode: 'createShapeSkin',
          blockType: BlockType.REPORTER,
          text: 'create [SHAPE] skin with color [COLOR] size [SIZE]',
          arguments: {
            SHAPE: {
              type: ArgumentType.STRING,
              menu: 'shapeMenu'
            },
            COLOR: {
              type: ArgumentType.COLOR,
              defaultValue: '#FF0000'
            },
            SIZE: {
              type: ArgumentType.NUMBER,
              defaultValue: 50
            }
          }
        },
        {
          opcode: 'applySkinToDrawable',
          blockType: BlockType.COMMAND,
          text: 'set [DRAWABLE] appearance to [SKIN]',
          arguments: {
            DRAWABLE: {
              type: ArgumentType.STRING,
              defaultValue: 'myDrawable'
            },
            SKIN: {
              type: ArgumentType.STRING,
              defaultValue: 'mySkin'
            }
          }
        }
      ],
      menus: {
        effectMenu: {
          acceptReporters: false,
          items: [
            { text: 'Ghost', value: 'ghost' },
            { text: 'Brightness', value: 'brightness' },
            { text: 'Color', value: 'color' }
          ]
        },
        shapeMenu: {
          acceptReporters: false,
          items: [
            { text: 'Circle', value: 'circle' },
            { text: 'Square', value: 'square' },
            { text: 'Triangle', value: 'triangle' }
          ]
        }
      }
    };
  }
}
```

## Performance Best Practices

### Optimizing Renderer Performance

```javascript
class OptimizedRenderExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.drawablePool = []; // Reuse drawables when possible
    this.skinCache = new Map(); // Cache frequently used skins
    this.updateQueue = []; // Batch updates
  }

  // Batch updates for better performance
  queueDrawableUpdate(drawableID, properties) {
    this.updateQueue.push({ drawableID, properties });
  }

  flushUpdates() {
    const renderer = this.runtime.renderer;
    
    // Apply all queued updates at once
    for (const update of this.updateQueue) {
      renderer.updateDrawableProperties(update.drawableID, update.properties);
    }
    
    this.updateQueue.length = 0;
  }

  // Reuse drawables to avoid constant creation/destruction
  getOrCreateDrawable() {
    if (this.drawablePool.length > 0) {
      return this.drawablePool.pop();
    }
    
    const renderer = this.runtime.renderer;
    return renderer.createDrawable('foreground');
  }

  releaseDrawable(drawableID) {
    const renderer = this.runtime.renderer;
    
    // Reset drawable properties
    renderer.updateDrawableProperties(drawableID, {
      visible: false,
      position: [0, 0, 0],
      effects: { ghost: 0, brightness: 0, color: 0 }
    });
    
    // Return to pool for reuse
    this.drawablePool.push(drawableID);
  }

  // Cache skins to avoid repeated creation
  getCachedSkin(cacheKey, createSkinFunction) {
    if (this.skinCache.has(cacheKey)) {
      return this.skinCache.get(cacheKey);
    }
    
    const skinId = createSkinFunction();
    this.skinCache.set(cacheKey, skinId);
    return skinId;
  }
}
```

## Extension Cleanup and Disposal

### Proper Resource Management

```javascript
class ResponsibleRenderExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customDrawables = new Map();
    this.customSkins = new Map();
    
    // Listen for project stop to cleanup
    this.runtime.on('PROJECT_STOP_ALL', this.cleanup.bind(this));
  }

  cleanup() {
    const renderer = this.runtime.renderer;
    
    // Destroy all custom drawables
    for (const drawableID of this.customDrawables.values()) {
      renderer.destroyDrawable(drawableID);
    }
    this.customDrawables.clear();
    
    // Destroy all custom skins
    for (const skinId of this.customSkins.values()) {
      renderer.destroySkin(skinId);
    }
    this.customSkins.clear();
  }

  dispose() {
    // Called when extension is unloaded
    this.cleanup();
    
    // Remove event listeners
    this.runtime.off('PROJECT_STOP_ALL', this.cleanup.bind(this));
  }
}
```

## Testing and Debugging

### Renderer Debugging Tools

```javascript
class DebugRenderExtension {
  getRendererInfo(args, util) {
    const renderer = util.runtime.renderer;
    
    const info = {
      hasRenderer: !!renderer,
      webGLSupported: !!renderer.gl,
      drawableCount: renderer._allDrawables ? renderer._allDrawables.length : 0,
      skinCount: renderer._allSkins ? renderer._allSkins.length : 0
    };
    
    console.log('Renderer Debug Info:', info);
    return JSON.stringify(info);
  }

  listCustomDrawables() {
    const drawables = Array.from(this.customDrawables.entries()).map(([name, id]) => ({
      name,
      id,
      exists: this.runtime.renderer._allDrawables.includes(id)
    }));
    
    console.log('Custom Drawables:', drawables);
    return JSON.stringify(drawables);
  }

  validateDrawable(args, util) {
    const name = args.DRAWABLE_NAME;
    const drawableID = this.customDrawables.get(name);
    const renderer = util.runtime.renderer;
    
    if (drawableID === undefined) {
      return `Drawable "${name}" not found in extension`;
    }
    
    const exists = renderer._allDrawables && renderer._allDrawables.includes(drawableID);
    return exists ? `Drawable "${name}" is valid` : `Drawable "${name}" has been destroyed`;
  }
}
```

The scratch-render API provides extensive capabilities for creating rich visual experiences in Scratch extensions. Remember to always manage resources properly, batch updates for performance, and test across different devices to ensure your visual extensions work smoothly for all users.