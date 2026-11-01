---
title: Advanced features
sidebar_label: Overview
description: The compiler, cloud variables, URL parameters, embedding, and the runtime options that lift Scratch's limits.
---

# Advanced features

These pages cover what MistWarp does beyond the Scratch editor: how projects are compiled, how to share data between players, how to control a project from its URL or an embed, and the runtime options that remove Scratch's limits.

## Projects and the web

- [JavaScript and the compiler](/advanced/javascript) explains how blocks become JavaScript, and how to run your own code.
- [Cloud variables](/advanced/cloud-variables) share values between everyone playing the same project.
- [URL parameters](/advanced/url-parameters) set options such as FPS, stage size or username from the link.
- [Embedding](/advanced/embedding) puts a project on another website with an iframe.
- [Unshared projects](/advanced/unshared-projects) explains why unshared Scratch projects cannot be opened.
- [CORS](/advanced/cors) explains why a fetch or networking block can fail even after you allow it.

## Runtime options

Each of these is a setting in the [editor settings](/editor/settings), and most also have a [URL parameter](/advanced/url-parameters). The [packager](/packager/overview) offers the same options.

| Option | What it changes |
| --- | --- |
| [Custom FPS](/advanced/custom-fps) | How many times per second scripts run (Scratch uses 30). |
| [Interpolation](/advanced/interpolation) | Smooths motion by drawing in-between frames, without speeding scripts up. |
| [Custom stage size](/advanced/custom-stage-size) | The stage dimensions, instead of 480x360. |
| [High quality pen](/advanced/high-quality-pen) | Draws the pen layer at the stage's real resolution. |
| [Warp timer](/advanced/warp-timer) | Stops long loops in warp mode from freezing the project. |
| [Infinite clones](/advanced/infinite-clones) | Removes the 300 clone limit. |
| [Remove fencing](/advanced/remove-fencing) | Lets sprites leave the stage and grow or shrink without limit. |
| [Remove miscellaneous limits](/advanced/remove-limits) | Lifts smaller limits, such as the pitch effect range and pen size. |
| [Disable compiler](/advanced/disable-compiler) | Interprets blocks one at a time, like Scratch. |
