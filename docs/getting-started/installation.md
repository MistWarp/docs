---
title: Getting Started
sidebar_position: 2
---

# Getting Started

MistWarp is a modified Scratch environment for developers. Access it at **[warp.mistium.com](https://warp.mistium.com/)**.

## About MistWarp

MistWarp is a fork of TurboWarp with modifications for advanced users familiar with JavaScript and programming concepts. It provides enhanced development capabilities for Scratch-like projects.

## System Requirements

- **Browser**: Chrome 80+, Firefox 78+, Safari 14+, or Edge 80+
- **Internet**: Required for web access
- **JavaScript**: Must be enabled

## Development Setup

For contributing to MistWarp development:

### Prerequisites
- Node.js 18+
- Git

### Clone and Build

```bash
git clone https://github.com/MistWarp/scratch-gui.git
cd scratch-gui
npm ci
npm start
```

Development server runs at `http://localhost:8601/`.

### Working with MistWarp Components

```bash
# Clone the full stack
git clone https://github.com/MistWarp/scratch-vm
git clone https://github.com/MistWarp/scratch-gui
git clone https://github.com/MistWarp/scratch-blocks
git clone https://github.com/MistWarp/scratch-render

# Link components
cd scratch-vm && npm link
cd ../scratch-render && npm link
cd ../scratch-blocks && npm link
cd ../scratch-gui && npm link scratch-vm scratch-render scratch-blocks
npm start
```

## Next Steps

- [Project Structure](../development/project-structure.md) - Understand the codebase
- [GUI Internals](../gui-internals/home.md) - Technical architecture
- [API Reference](../api-reference/) - Programming interfaces
