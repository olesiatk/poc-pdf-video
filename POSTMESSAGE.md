# postMessage contract

All messages this app sends/expects when embedded in an `<iframe>`. Sent from
[src/postMessage.ts](src/postMessage.ts) unless noted. Host is expected to
listen with an origin check (`event.origin`) and match on `event.data.type`.

## Outbound — app → host

### `poc-resize-iframe`

Reported height of the app's own content, so the host can size the `<iframe>`
to fit without inner/outer scrollbars. Sent on load, on window resize, on any
layout change to the app's root element (`ResizeObserver`), and on-demand
when the host asks (see [`ask-for-height`](#ask-for-height-inbound) below).

Sent from [useIframeResize.ts](src/hooks/useIframeResize.ts).

```json
{ "type": "poc-resize-iframe", "height": 879 }
```

| field  | type   | notes                              |
| ------ | ------ | ----------------------------------- |
| height | number | px, rounded up (`Math.ceil`)        |

Host: set `iframeEl.style.height = height + 'px'`.

---

### `poc-tour-status`

Fired when the guided product tour (driver.js) opens/closes. Useful if the
host wants to e.g. dim its own chrome or pause background scroll while the
tour is active.

Sent from [tour.ts](src/tour.ts).

```json
{ "type": "poc-tour-status", "active": true }
```

| field  | type    | notes                          |
| ------ | ------- | ------------------------------- |
| active | boolean | `true` on start, `false` on end |

For the host's own dimming to match this app's, when `active: true`: overlay
color `#000` at `0.7` opacity (i.e. `background: #00000070` /
`rgba(0, 0, 0, 0.7)`).

---

### `poc-modal`

Fired when the app's own in-iframe fullscreen modal (file preview) opens or
closes. Lets the host know the iframe's content is temporarily "full-screen
within itself" — e.g. useful for suppressing host-level scroll alongside it.

Sent from [Modal.tsx](src/components/Modal.tsx).

```json
{ "type": "poc-modal", "open": true }
```

| field | type    | notes                          |
| ----- | ------- | -------------------------------- |
| open  | boolean | `true` on open, `false` on close |

This is the *in-iframe* modal, not the host-side one below. Same dimming as
`poc-tour-status` when `open: true`: overlay color `#000` at `0.7` opacity
(`background: #00000070` / `rgba(0, 0, 0, 0.7)`).

---

### `poc-open-media`

Requests that the **host** open a file (PDF/video/image) in its own full-screen
modal — outside the iframe's viewport, which can't otherwise escape its own
box. Sizing/styling of that modal lives entirely on the host side and isn't
tracked here since it may change independently of this contract.

Sent from [postMessage.ts](src/postMessage.ts) (`sendOpenMedia`), triggered
by the "⧉ Open in host modal" button in
[MediaViewer.tsx](src/components/MediaViewer.tsx).

Two payload shapes, depending on the file's origin:

**Statically hosted file** (e.g. a sample under `public/samples/`) — sent as
a plain absolute URL:

```json
{
  "type": "poc-open-media",
  "payload": {
    "mediaType": "pdf",
    "name": "Phrasal verbs handout.pdf",
    "url": "https://your-app.example.com/samples/Phrasal%20verbs%20handout.pdf"
  }
}
```

**User-uploaded file** — its `url` is a `blob:` URL scoped to this app's own
iframe context, so the host could never load it directly. The actual file is
sent instead, as a real `Blob`, via `postMessage`'s structured clone:

```json
{
  "type": "poc-open-media",
  "payload": {
    "mediaType": "video",
    "name": "recording.mp4",
    "file": Blob // File contents — not a string, a real Blob object
  }
}
```

| field       | type              | notes                                          |
| ----------- | ----------------- | ----------------------------------------------- |
| mediaType   | `'pdf' \| 'video' \| 'image'` |                                        |
| name        | string             | original file name                              |
| url         | string             | present for statically hosted files             |
| file        | Blob               | present for user-uploaded files, instead of `url` |

Host handling: set the modal's title text from `payload.name`. If
`payload.file` is present, call `URL.createObjectURL(payload.file)` to get a
URL usable in the host's own document and set that as the (single, reused)
`<iframe>`'s `src`; otherwise set `src` to `payload.url` directly. PDFs render
via the browser's built-in viewer this way; videos and most other file types
also work fine in an iframe. Reveal the overlay, set `document.body.style.overflow
= 'hidden'` while it's open, and attach the `Escape` keydown listener.

Close on: backdrop click, close (×) button, `Escape`. On close: hide the
overlay, restore `body.style.overflow`, remove the `Escape` listener, and — if
a `file` Blob was used — call `URL.revokeObjectURL()` on the object URL
created for it, otherwise every open leaks memory.

## Inbound — host → app

### `ask-for-height`

Host can send this at any time to request an immediate, up-to-date height
report — the app responds with [`poc-resize-iframe`](#poc-resize-iframe).
Useful right after the host inserts/resizes the iframe, before the app's own
resize triggers have fired.

Handled in [useIframeResize.ts](src/hooks/useIframeResize.ts).

```json
{ "type": "ask-for-height" }
```

## Origin

The app currently posts with target origin `'*'` (see `postToParent` in
[postMessage.ts](src/postMessage.ts)) since the production host domain isn't
pinned yet. Before going live, replace `'*'` with the real host origin on the
app side, and add an `event.origin` check on the host side — otherwise any
page that iframes this app can send/receive these messages.
