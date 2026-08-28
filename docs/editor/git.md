---
title: Version history
sidebar_position: 22
---

MistWarp keeps version history in the background. Your first **Save to MistWarp** creates an initial version without asking you to name it. Later saves ask **What changed?** and use that short note to label the new version. You can inspect or restore old versions and use branches without learning Git first. The `.mwp` project file carries the complete history and every branch.

You can use **File, Export, Scratch project (.sb3)** to make a standard copy for Scratch or TurboWarp. The project itself is preserved, but the exported `.sb3` does not include its Git history.

Version control suits larger or longer-lived projects, and it is the foundation for MistWarp's remix-and-pull-request workflow.

## Opening version control

Open the **Tools** menu and choose **Version history**. Its sidebar has **History**, **Branches**, and **Connections**.

MistWarp initializes history automatically for account projects and forks. If you deliberately open a standalone project in the advanced Version history window, you can also initialize it there or clone an existing project by URL.

## History

**History** lists saved versions with their note, date, author, and a colour-coded branch graph. Separate lanes show where branches split and merge. Project owners can choose **Restore this version** on the web project page. Restoring adds a new version with the old contents, so it does not delete anything that came later.

## Branches and merging

**Branches** lets you create, switch, and delete branches so you can develop a feature without disturbing your main line. To combine branches, pick a source branch and **Preview** the merge.

If the merge has conflicts, MistWarp lists each conflicting file and asks you to choose a side, **Ours** or **Theirs**, for each one, then **Apply merge**. For anything more involved, **Resolve in editor** opens the conflicting files in the code editor with the usual conflict markers so you can resolve them by hand.

## Connections

Paste a repository URL under **Connections**. MistWarp gives it an internal name and syncs the current branch after every successful Save to MistWarp. MistWarp saves its own copy first, so a connection failure cannot lose the MistWarp version.

RoturGit is optional. A RoturGit URL uses your Rotur sign-in automatically. Other services can use the token or password stored in the Connections page. RoturGit can also supply issues and hosted pull requests, but MistWarp does not require it for local branches, `.mwp` history, remixes, or MistWarp pull requests.

## See also

- [Live collaboration](/editor/collaboration) for real-time co-editing
- [Project management](/editor/project-management)
- [Restore points](/editor/restore-points) for a simpler local safety net
