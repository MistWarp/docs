---
title: The stage
---

The stage is where your project runs. Sprites move, draw, and respond to input on it. It sits on one side of the editor with its controls above it and the [sprite pane](/editor/sprites) below.

## Coordinates and size

The stage uses a coordinate grid centred on `(0, 0)`. By default it is 480 wide by 360 tall, so `x` runs from `-240` (left) to `240` (right) and `y` from `-180` (bottom) to `180` (top).

MistWarp lets you change these dimensions with [custom stage size](/advanced/custom-stage-size). Everything on this page still applies; only the numbers change.

## Green flag and stop

Above the stage are the run controls:

- **Green flag** starts the project. It broadcasts the "when green flag clicked" event to every sprite.
- **Stop** (the red octagon) halts every running script.

When [turbo mode](#turbo-mode) is on, a **Turbo Mode** label appears next to them. MistWarp's [custom FPS](/advanced/custom-fps) and [interpolation](/advanced/interpolation) settings also change how the stage updates.

## Turbo mode

Turbo mode makes scripts run as fast as possible. Normally a loop that moves a sprite or draws with the pen pauses after each pass so the stage can redraw. In turbo mode MistWarp runs as many passes as it can before each redraw, so heavy projects such as pen renderers, simulations and list processing finish much sooner.

Turn it on or off in any of these ways:

- **Shift-click the green flag.**
- Choose **Turn on Turbo Mode** (or **Turn off Turbo Mode**) in the **Edit** menu of the [menu bar](/editor/menu-bar).
- Add `?turbo` to the project URL (see [URL parameters](/advanced/url-parameters)).

Turbo mode is not saved in the project. Projects that rely on frame timing, such as most games, can run too fast with it on. To make a single custom block finish in one frame instead, use **Run without screen refresh** on [My Blocks](/blocks/my-blocks).

## Stage size controls

To the right of the run controls, a group of buttons changes how much room the stage takes in the editor. The available modes are:

- **Hide**: collapse the stage away entirely and give the whole window to the editing area.
- **Small**: shrink the stage to half width, leaving more room for blocks.
- **Large**: the default fixed size.
- **Full**: grow the stage to fill the available space.

These only change the editor layout. They do not change your project's actual stage dimensions or how it looks when shared.

## Fullscreen and presentation mode

The **fullscreen** button (the expand icon) enlarges the stage to fill the screen and hides the editor, so you can play the project. A matching control returns you to the editor. In fullscreen you still have the green flag and stop button.

Shared projects and [embeds](/advanced/embedding) show this same player view without the editor around it.

## Interacting with the stage

While the project runs you can click and drag sprites (if they are set draggable, or always in the editor), type answers to "ask" prompts, and trigger key and mouse events. If a project uses right-click, right-clicking the stage is passed to the project; otherwise the stage has no editor-specific right-click menu.

## Advanced

- [Custom stage size](/advanced/custom-stage-size) changes the width and height, including at runtime.
- [High quality pen](/advanced/high-quality-pen) renders pen and the stage at your display's full resolution.
- [Interpolation](/advanced/interpolation) smooths motion between frames.
- [Remove fencing](/advanced/remove-fencing) lets sprites move fully off the stage.

## See also

- [Sprites](/editor/sprites)
- [The interface](/editor/interface)
- [Settings](/editor/settings)
