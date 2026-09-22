---
title: Live collaboration
sidebar_position: 23
---

Live collaboration lets several people edit the same project at once, in real time. Everyone works in their own editor, and changes to blocks, sprites, costumes, and sounds sync between all of you, with live cursors showing who is working where.

:::warning
Live collaboration is an alpha feature and is still in early development. Projects edited in a collaborative session can be corrupted or broken. Keep your own [restore points](/editor/restore-points) or a saved copy while you use it.
:::

## Starting or joining a session

Open the **Tools** menu and choose **Live Collaboration**. The window shows the username you will appear as, and two options:

- **Create a New Room**: host a room. You get a room code (and a URL you can share) that others use to join. You are the room's **host**.
- **Join an Existing Room**: enter a room code to join a room someone else is hosting.

Sharing a room is done by sending its URL, which carries a `?room=` code; opening that link joins the room automatically. If you have unsaved changes when you join a room, MistWarp offers to save them first.

## Inviting friends

If you are signed in with Rotur, the **Friends** section of the Live Collaboration window shows which of your Rotur friends have MistWarp open right now, with what they are working on. You can also open it with the **Friends** button in the menu bar, which shows how many friends are online.

The first time, choose **Show my friends**. Rotur asks you once to let MistWarp read your friends list.

- **Invite** sends a friend an invite to edit your project with you. If you are not in a session yet, MistWarp opens a private one for you. If your project is saved to MistWarp and you can host its live session, the invite uses that session instead.
- The friend sees a card with **Join** and **Decline**. **Join** explains that their editor will switch to your project, and warns them if it would take them out of a session they are already in. If they have unsaved changes, they can choose **Save and join** to save first (the same save as Ctrl+S) or **Join without saving**. MistWarp also keeps a device backup before the project is replaced. Invited friends skip the approval queue, and the invite only works for the person you sent it to.
- **Ask to join** appears next to friends who are in a live session. Their host gets a card and can answer with an invite.
- **Add friend** sends a Rotur friend request by username, and incoming friend requests appear at the top of the section with **Accept** and **Decline**. In a session, **Add friend** also appears next to collaborators who are not your friends yet.

Invites expire after two minutes, and ending a session cancels any invites that have not been answered. Only the host can invite people into a session.

Turn off **Let friends see when I am here and invite me** to stop appearing online to friends. You can still see them and invite them, but they cannot invite you. The same switch is in the Presence section of [Settings](https://mistwarp.org/settings?section=presence) on the MistWarp website, and it syncs between your devices.

## During a session

Once connected, the window lists everyone in the room. Each person shows their avatar and name, a **Host** or **You** badge where relevant, and a live description of what they are doing, for example "Editing code in Sprite1" or "Editing costume in the Stage". In the workspace you see other people's **cursors** with name labels as they move around.

**Copy Room URL to Share** copies the invite link, and **Leave Room** disconnects you.

## Host controls and privacy

The person who created the room is the host and has extra controls:

- **Kick** any other participant.
- Set the room to **Public** (anyone with the code can join) or **Private** (people must request approval).
- In a private room, **approve or deny** each pending join request. Friends you invite join without waiting for approval.

When you join a private room you wait for the host to approve you before entering.

:::note
The host relays everyone's edits, which means the host can see the IP addresses of people who join, and in a room you create, joiners can see yours. The privacy notices in the window spell this out before you host or join.
:::

## Collaboration versus git

Live collaboration is for editing together at the same moment. For asynchronous teamwork, where people make changes separately and combine them later, use [git version control](/editor/git) instead.

## See also

- [Git version control](/editor/git)
- [Restore points](/editor/restore-points)
- [The block workspace](/editor/workspace)
