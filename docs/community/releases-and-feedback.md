---
title: Releases, previews and diagnostics
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

You can send an improvement without changing the creator's project directly:

1. Open the project page and check **Contribute** for open bounties. Picking a bounty is optional.
2. Select **Remix** to create a private fork.
3. Make your changes in the fork and save it to MistWarp.
4. Open the fork's project page, choose **Contribute**, and create a pull request.
5. The project owner reviews the changes and decides whether to merge them.

A pull request follows your fork. Commits you save to the fork after opening it appear in the pull request, so you can answer review feedback by changing the fork. Owners need to commit any changes they saved in the editor before merging, and the project has to be on the branch the pull request targets.

When the original project gets new commits, keep your fork up to date with **Sync with original**. It is on the fork's developer view (the **Code** tab), next to the line that says how far ahead and behind the original your fork is. A sync brings the original's new commits into your fork as one merge commit. If you and the original changed the same part of a sprite, edit the marked conflict and choose which version of each changed costume or sound to keep, then select **Save resolutions and sync**. Commit any changes you saved in the editor first, because the synced project replaces them. Projects whose history was saved before sprites were stored as separate files show one conflict for the whole project, so you choose either your fork or the original.

A bounty is a credit reward for a specific piece of work. Attach it when you create the pull request. MistWarp pays the reward when the project owner merges that pull request. Creating a fork or pull request alone does not claim the credits.

Project owners create bounties under **Manage and analytics**, **Collaboration**, then **Bounties**. A useful bounty says exactly what should change and what the owner will accept as done.

The editor menu bar also has a project activity button. It opens comments and pull requests without closing the editor.

## Project teams

Project owners can add people from **Manage and analytics**, then **Team**. Each role has a different level of access:

- **Maintainers** can edit, publish, create previews, and merge pull requests.
- **Contributors** send changes through pull requests.
- **Testers** can open private project drafts without receiving editing access.

Only the owner can change the team or delete the project.
