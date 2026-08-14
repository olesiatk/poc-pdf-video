export const POC_MESSAGE = {
  RESIZE: 'poc-resize-iframe',
  TOUR_STATUS: 'poc-tour-status',
  MODAL: 'poc-modal',
  ROUTING: 'poc-routing',
  OPEN_MEDIA: 'poc-open-media',
} as const;

export function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin parent blocks access to window.top — that only happens when embedded.
    return true;
  }
}

function postToParent(message: Record<string, unknown>) {
  if (!isEmbedded()) return;
  window.parent.postMessage(message, '*');
}

export function sendResize(height: number) {
  postToParent({ type: POC_MESSAGE.RESIZE, height });
}

export function sendTourStatus(active: boolean) {
  postToParent({ type: POC_MESSAGE.TOUR_STATUS, active });
}

export function sendModalStatus(open: boolean) {
  postToParent({ type: POC_MESSAGE.MODAL, open });
}

export function sendRouting(path: string) {
  postToParent({ type: POC_MESSAGE.ROUTING, path });
}

export function sendOpenMedia(mediaType: 'pdf' | 'video', url: string, name: string) {
  // Resolve against this app's origin so the host's overlay iframe (a different
  // document/origin) doesn't try to load a path relative to its own page.
  const absoluteUrl = new URL(url, window.location.href).href;
  postToParent({ type: POC_MESSAGE.OPEN_MEDIA, payload: { mediaType, url: absoluteUrl, name } });
}
