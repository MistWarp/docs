---
title: URL Parameters
sidebar_position: 10
---

# URL Parameters

MistWarp supports extensive URL parameters that allow you to customize the interface, load projects, and control behavior directly through the URL. This is particularly useful for embedding, automation, and creating custom experiences.

## Basic Usage

### URL Parameter Syntax
Add parameters to the MistWarp URL using standard query string format:
```
https://warp.mistium.com/?parameter1&parameter2=value&parameter3=value
```

### Multiple Parameters
Combine multiple parameters with `&`:
```
https://warp.mistium.com/?turbo&fps=60&username=alice&autoplay
```

## Project Loading Parameters

### Load Project by ID
Load a Scratch project by its ID:
```
https://warp.mistium.com/123456789
```

### Load Project from URL
Load a project from a direct URL:
```
https://warp.mistium.com/?project_url=https://example.com/project.sb3
```

### Auto-start Projects
Automatically start the project when loaded:
```
https://warp.mistium.com/123456789?autoplay
```

### Project Title
Set a custom title for the project:
```
https://warp.mistium.com/123456789?title=My%20Amazing%20Game
```

## Performance Parameters

### Turbo Mode
Enable high-speed compilation:
```
https://warp.mistium.com/?turbo
```

### Frame Rate Control
Set custom frame rate:
```
https://warp.mistium.com/?fps=60     # 60 FPS
https://warp.mistium.com/?fps=120    # 120 FPS
https://warp.mistium.com/?fps=30     # 30 FPS (default)
```

### High Quality Pen
Enable anti-aliased pen rendering:
```
https://warp.mistium.com/?hqpen
```

### Remove Interpolation
Disable frame interpolation for maximum speed:
```
https://warp.mistium.com/?nointerp
```

### Remove Limits
Remove sprite and clone limits:
```
https://warp.mistium.com/?nolimits
```

## Display Parameters

### Custom Stage Size
Set custom stage dimensions:
```
https://warp.mistium.com/?size=800x600
https://warp.mistium.com/?size=1920x1080
```

### Fullscreen Mode
Start in fullscreen mode:
```
https://warp.mistium.com/?fullscreen
```

### Hide Controls
Hide various interface elements:
```
https://warp.mistium.com/?controls=0          # Hide all controls
https://warp.mistium.com/?hide-controls       # Alternative syntax
```

### Cloud Variables Username
Set username for cloud variables:
```
https://warp.mistium.com/?username=alice
```

## Interface Customization

### Theme Selection
Apply specific themes:
```
https://warp.mistium.com/?theme=dark
https://warp.mistium.com/?theme=light
https://warp.mistium.com/?theme=high-contrast
```

### Custom Colors
Set custom accent colors:
```
https://warp.mistium.com/?accent=blue
https://warp.mistium.com/?accent=%23ff0000    # Custom hex color
```

### Hide Sidebar
Hide the project sidebar:
```
https://warp.mistium.com/?hide-sidebar
```

### Disable Addons
Disable specific addons or all addons:
```
https://warp.mistium.com/?disable-addon=sprite-properties
https://warp.mistium.com/?disable-addons     # Disable all
```

## Embedding Parameters

### Embed Mode
Enable embed mode for iframe usage:
```
https://warp.mistium.com/123456789/embed
```

### Remove Branding
Hide MistWarp branding (embed mode):
```
https://warp.mistium.com/123456789/embed?nobranding
```

### Transparent Background
Use transparent background:
```
https://warp.mistium.com/123456789/embed?transparent
```

### Mouse and Keyboard
Control input methods:
```
https://warp.mistium.com/123456789/embed?mouse=1&keyboard=1
```

## Development Parameters

### Debug Mode
Enable debugging features:
```
https://warp.mistium.com/?debug
```

### JavaScript Access
Enable custom JavaScript:
```
https://warp.mistium.com/?unsafe
```

### Extension Loading
Load custom extensions:
```
https://warp.mistium.com/?extension=https://example.com/extension.js
```

### Compatibility Mode
Enable Scratch compatibility mode:
```
https://warp.mistium.com/?compatibility
```

## Advanced Parameters

### Custom Cloud Host
Use custom cloud variable server:
```
https://warp.mistium.com/?cloud_host=ws://localhost:3000
```

### Project JSON
Load project from inline JSON:
```
https://warp.mistium.com/?project_json={"targets":[...]}
```

### Asset Host
Custom asset server:
```
https://warp.mistium.com/?asset_host=https://assets.example.com
```

### Renderer Type
Force specific renderer:
```
https://warp.mistium.com/?renderer=webgl
https://warp.mistium.com/?renderer=canvas
```

## Complete Parameter Reference

### Performance Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| `turbo` | boolean | Enable turbo mode |
| `fps` | 30, 60, 120 | Set frame rate |
| `hqpen` | boolean | High quality pen |
| `nointerp` | boolean | Disable interpolation |
| `nolimits` | boolean | Remove sprite limits |
| `warp` | boolean | Enable warp timer |

### Display Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| `size` | WIDTHxHEIGHT | Custom stage size |
| `fullscreen` | boolean | Start fullscreen |
| `controls` | 0, 1 | Show/hide controls |
| `transparent` | boolean | Transparent background |

### Project Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| `autoplay` | boolean | Auto-start project |
| `title` | string | Custom project title |
| `username` | string | Cloud variables username |
| `project_url` | URL | Load from URL |

### Interface Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| `theme` | dark, light, etc. | Interface theme |
| `accent` | color name/hex | Accent color |
| `hide-sidebar` | boolean | Hide sidebar |
| `hide-controls` | boolean | Hide controls |

### Development Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| `debug` | boolean | Debug mode |
| `unsafe` | boolean | Allow JavaScript |
| `extension` | URL | Load extension |
| `compatibility` | boolean | Scratch compatibility |

## URL Parameter Examples

### Gaming Setup
Optimized for games:
```
https://warp.mistium.com/123456789?turbo&fps=60&fullscreen&autoplay
```

### Educational Embedding
Clean embed for education:
```
https://warp.mistium.com/123456789/embed?controls=0&autoplay&size=800x600
```

### Development Testing
Development environment:
```
https://warp.mistium.com/?debug&unsafe&turbo&fps=120
```

### High Performance
Maximum performance:
```
https://warp.mistium.com/?turbo&nointerp&nolimits&fps=120&hqpen
```

### Accessible Mode
High contrast and accessible:
```
https://warp.mistium.com/?theme=high-contrast&size=1200x900
```

## URL Encoding

### Special Characters
Encode special characters in URLs:
```
Space: %20
#: %23
&: %26
=: %3D
```

### Example with Encoding
```
https://warp.mistium.com/?title=My%20Project&accent=%23ff0000
```

## JavaScript URL Manipulation

### Reading Parameters
```javascript
const urlParams = new URLSearchParams(window.location.search);
const turboMode = urlParams.has('turbo');
const fps = urlParams.get('fps') || '30';
```

### Setting Parameters
```javascript
const url = new URL(window.location);
url.searchParams.set('fps', '60');
url.searchParams.set('turbo', '');
window.history.pushState({}, '', url);
```

### Building URLs Programmatically
```javascript
function buildMistWarpURL(projectId, options = {}) {
  const url = new URL(`https://warp.mistium.com/${projectId}`);
  
  Object.entries(options).forEach(([key, value]) => {
    if (value === true) {
      url.searchParams.set(key, '');
    } else if (value !== false && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
}

// Usage
const gameURL = buildMistWarpURL('123456789', {
  turbo: true,
  fps: 60,
  autoplay: true,
  theme: 'dark'
});
```

## Best Practices

### URL Length
- Keep URLs reasonable length (under 2000 characters)
- Use essential parameters only
- Consider using short parameter names

### User Experience
- Provide sensible defaults
- Use autoplay sparingly
- Test URLs thoroughly

### Performance
- Combine compatible performance parameters
- Test performance impact of parameter combinations
- Monitor for conflicts between parameters

URL parameters provide powerful customization capabilities for MistWarp. Use them to create tailored experiences for different users and use cases!
