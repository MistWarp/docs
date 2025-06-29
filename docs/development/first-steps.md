---
title: First Steps
sidebar_position: 3
---

# Brand configuration for MistWarp.

This file defines the application name and other configuration options used by build-time scripts.

## Renaming Your Mod
To rename your mod, update the `APP_NAME` property in the file `src/lib/brand.js` in the scratch-gui with your desired name:

```js
module.exports = {
    APP_NAME: 'YourModName',
    FEEDBACK_URL: 'https://scratch.mit.edu/users/m1stium#comments',
    GITHUB_URL: 'https://github.com/MistWarp'
};
```

You can also update other properties, such as `FEEDBACK_URL` and `GITHUB_URL`, to customize feedback and repository links for your mod.

Make sure to save the file and rebuild your project for the changes to take effect.