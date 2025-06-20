---
title: Advanced Settings
sidebar_position: 4
---

# Advanced Settings

MistWarp provides extensive configuration options that allow you to customize performance, behavior, and appearance. This guide covers all advanced settings available in MistWarp.

## Accessing Advanced Settings

### Via Interface
1. Click the **Settings** gear icon in the editor
2. Navigate to **Advanced** tab
3. Configure options as needed
4. Settings save automatically

### Via URL Parameters
Many settings can be controlled via URL parameters:
```
https://warp.mistium.com/?turbo&hqpen&fps=60
```

## Performance Settings

### Compiler Options

#### Turbo Mode
- **Purpose**: Enables high-speed project execution
- **Effect**: 2-10x performance improvement
- **Compatibility**: Works with most projects
- **Toggle**: Click turbo button or use `?turbo` URL parameter

#### Frame Rate Control
- **Default**: 30 FPS (same as Scratch)
- **Options**: 30, 60, 120 FPS
- **URL Parameter**: `?fps=60`
- **Impact**: Higher FPS = smoother animation, more CPU usage

#### High Quality Pen
- **Purpose**: Anti-aliased pen rendering
- **Effect**: Smoother lines and shapes
- **Performance**: Slightly slower drawing
- **URL Parameter**: `?hqpen`

### Memory Management

#### Remove Sprite Fencing
- **Purpose**: Allow sprites to go outside stage bounds
- **Effect**: Improved performance, different behavior
- **Compatibility**: May affect some projects
- **Use Case**: Large-scale simulations

#### Disable Interpolation
- **Purpose**: Skip frame interpolation for maximum speed
- **Effect**: Choppy animation at low frame rates
- **Benefit**: Maximum performance for computational projects

## Stage Configuration

### Custom Stage Sizes

#### Preset Sizes
- **480×360**: Default Scratch size
- **960×720**: 2x Scratch size
- **1920×1080**: Full HD
- **Custom**: Any size up to browser limits

#### Dynamic Resizing
```javascript
// Via JavaScript in project
setStageSize(800, 600);
```

### Stage Options

#### Remove Limits
- **Sprite Count**: No limit on simultaneous sprites
- **Clone Count**: No limit on clones (within memory)
- **Variable Count**: No limit on variables

#### Rendering Options
- **Force Canvas**: Use Canvas renderer (better performance)
- **Force WebGL**: Use WebGL renderer (better quality)
- **Pixel Perfect**: Disable anti-aliasing for pixel art

## Audio Settings

### Audio Engine

#### Audio Context
- **Purpose**: Lower latency audio
- **Effect**: More responsive sound effects
- **Compatibility**: Most modern browsers

#### Sample Rate
- **Options**: 22050, 44100, 48000 Hz
- **Default**: 22050 Hz (Scratch compatible)
- **Quality**: Higher = better quality, more CPU

### Audio Enhancements

#### Spatial Audio
- **3D Positioning**: Sounds can have 3D position
- **Distance Attenuation**: Volume decreases with distance
- **Panning**: Automatic left/right channel panning

## Input/Output Options

### Input Enhancements

#### Custom Key Bindings
- **Remap Keys**: Change default key assignments
- **Global Shortcuts**: Shortcuts that work outside project
- **Accessibility**: Support for alternative input devices

#### Mouse Options
- **High Precision**: Sub-pixel mouse positioning
- **Raw Input**: Direct mouse input without browser filtering
- **Custom Cursors**: Project-defined cursor shapes

### Cloud Variables

#### Alternative Providers
- **Custom Servers**: Connect to non-Scratch cloud servers
- **Local Storage**: Use browser storage as cloud variables
- **WebSocket**: Real-time synchronization

#### Security Options
- **Encryption**: Encrypt cloud variable data
- **Rate Limiting**: Prevent spam and abuse
- **Validation**: Server-side data validation

## Development Features

### Debugging Tools

#### Console Integration
- **JavaScript Console**: Access browser dev tools
- **Variable Inspector**: Real-time variable monitoring
- **Performance Profiler**: Identify bottlenecks

#### Error Handling
- **Detailed Errors**: Enhanced error messages
- **Stack Traces**: Full error stack information
- **Recovery**: Automatic error recovery when possible

### Export Options

#### Enhanced Export
- **Standalone HTML**: Single-file projects
- **Web Applications**: Browser-based apps
- **Progressive Web Apps**: Installable web apps

#### Optimization
- **Asset Compression**: Reduce file sizes
- **Code Minification**: Optimize JavaScript
- **Tree Shaking**: Remove unused code

## Accessibility

### Visual Accessibility

#### High Contrast Mode
- **Purpose**: Better visibility for visual impairments
- **Options**: Multiple high contrast themes
- **Compliance**: WCAG accessibility standards

#### Text Scaling
- **Font Size**: Adjustable UI font sizes
- **Icon Size**: Scalable interface icons
- **Layout**: Responsive design adaptation

### Motor Accessibility

#### Keyboard Navigation
- **Full Navigation**: Navigate entire interface via keyboard
- **Custom Shortcuts**: Customizable keyboard shortcuts
- **Sticky Keys**: Support for accessibility tools

## Privacy & Security

### Data Protection

#### Local Storage
- **Project Data**: All data stored locally by default
- **No Tracking**: No personal data collection
- **Offline Mode**: Full functionality without internet

#### External Connections
- **Asset Loading**: Control external asset loading
- **Cloud Sync**: Optional cloud synchronization
- **Analytics**: Disable usage analytics

### Content Security

#### Script Security
- **Sandboxing**: Scripts run in secure sandbox
- **Permission System**: Control script capabilities
- **Code Review**: Manual review for suspicious code

## Experimental Features

:::warning
Experimental features may be unstable or change without notice.
:::

### Advanced Compilation
- **WASM Compilation**: Compile to WebAssembly
- **GPU Acceleration**: Use GPU for computations
- **Multi-threading**: Parallel script execution

### Cutting-Edge APIs
- **WebXR**: Virtual and Augmented Reality
- **WebRTC**: Real-time communication
- **Machine Learning**: TensorFlow.js integration

## Configuration Files

### Export Settings
Save your configuration as a file:
```json
{
  "turbo": true,
  "fps": 60,
  "hqpen": true,
  "stageSize": [800, 600],
  "removeSpriteFencing": true
}
```

### Import Settings
Load settings from configuration files or URLs.

## URL Parameter Reference

| Parameter | Values | Description |
|-----------|--------|-------------|
| `turbo` | boolean | Enable turbo mode |
| `fps` | 30, 60, 120 | Set frame rate |
| `hqpen` | boolean | High quality pen |
| `size` | WIDTHxHEIGHT | Custom stage size |
| `nointerp` | boolean | Disable interpolation |
| `nolimits` | boolean | Remove sprite limits |

## Performance Tips

1. **Enable Turbo Mode** for computational projects
2. **Use 60 FPS** for smooth animations
3. **Disable interpolation** for maximum speed
4. **Custom stage sizes** for specific use cases
5. **Monitor memory usage** for large projects

MistWarp's advanced settings give you unprecedented control over your Scratch experience. Experiment with different configurations to find what works best for your projects!
