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

No host styling required.

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

No host styling required — this is the *in-iframe* modal, not the host-side
one below.

---

### `poc-routing`

Fired whenever the app's internal route changes (React Router). Lets the host
mirror the current path — e.g. to update its own URL bar/breadcrumbs, or for
analytics.

Sent from [RouteBridge.tsx](src/components/RouteBridge.tsx).

```json
{ "type": "poc-routing", "path": "/library" }
```

| field | type   | notes                                 |
| ----- | ------ | --------------------------------------- |
| path  | string | `location.pathname + location.search`  |

---

### `poc-open-media`

Requests that the **host** open a file (PDF/video) in its own full-screen
modal — outside the iframe's viewport, which can't otherwise escape its own
box. This is the one message with host-side styling attached (below).

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
| mediaType   | `'pdf' \| 'video'` |                                                  |
| name        | string             | original file name                              |
| url         | string             | present for statically hosted files             |
| file        | Blob               | present for user-uploaded files, instead of `url` |

Host handling: if `payload.file` is present, call
`URL.createObjectURL(payload.file)` to get a URL usable in the host's own
document; otherwise use `payload.url` directly. Either way, load it in an
`<iframe>` inside the host's modal (PDFs render via the browser's built-in
viewer this way; videos and most other file types also work fine in an
iframe).

**Host styling** (full-screen modal, escaping the app's iframe):

```css
.poc-host-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1100; /* above the site header (999) and any other overlay */
  display: flex;
  align-items: center;
  justify-content: center;
}

.poc-host-modal {
  width: 85vw;
  height: 85vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.poc-host-modal iframe {
  width: 100%;
  height: 100%;
  border: none;
}
```

Close on: backdrop click, close (×) button, `Escape`. On close, remove the
iframe from the DOM (stops any playing video/audio) and, if a `file` Blob was
used, call `URL.revokeObjectURL()` on the object URL created for it —
otherwise every open leaks memory.

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
