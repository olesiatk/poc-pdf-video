export const POC_MESSAGE = {
  RESIZE: 'poc-resize-iframe',
  TOUR_STATUS: 'poc-tour-status',
  MODAL: 'poc-modal',
  ROUTING: 'poc-routing',
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
