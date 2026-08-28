---
title: Releases, previews, and diagnostics
sidebar_position: 2
---

## Releases

Project owners can publish named releases from the project page. Every release stores an immutable copy of `project.json`, while assets remain content-addressed in project storage.

Releases use one of three channels:

- **Stable** becomes the version played on the public project page.
- **Beta** is available through its release link for testing.
- **Development** records a work-in-progress checkpoint.

Saving the project does not change a stable release. Publish another stable release when the new work is ready for everyone.

## Draft previews

Open **My Stuff**, choose **Manage and analytics**, then open **Preview links**. A preview link lasts for 24 hours and lets anyone with the link play the current private draft.

Preview links do not publish the project or add it to Explore.

## Bug reports, suggestions, and diagnostics

Project comments can be marked as a bug report, suggestion, or question. The comments tab and the editor's Project activity window can search comments and filter them by type.

The creator dashboard records anonymous player events:

- Project loaded.
- Green flag clicked.
- Player closed.
- Runtime error.

Diagnostics include loading time, broad input device type, and a short error message. They do not include project scripts, variable values, or the viewer's username.

## Contributions

Projects backed by a Rotur Git repository have a **Contribute** tab. Remix the project, edit and save the remix, then send its project ID back to the original project. MistWarp creates a pull request for the creator to review and merge.

The editor menu bar also has a project activity button. It opens comments and pull requests without closing the editor.

## Project teams

Project owners can add people from **Manage and analytics**, then **Team**. Each role has a different level of access:

- **Maintainers** can edit, publish, create previews, and merge pull requests.
- **Contributors** send changes through pull requests.
- **Testers** can open private project drafts without receiving editing access.

Only the owner can change the team or delete the project.
