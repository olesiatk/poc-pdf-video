import { useLayoutEffect } from 'react';
import { sendResize } from '../postMessage';

export function useIframeResize() {
  // useLayoutEffect (not useEffect) so the first measurement happens before the
  // browser paints, rather than one frame after — the earlier it fires, the less
  // often the parent iframe visibly starts at the wrong size.
  useLayoutEffect(() => {
    const root = document.getElementById('root');

    const sendHeightToParent = () => {
      // document.documentElement.scrollHeight can get "stuck" at the tallest height
      // the page has ever reached — it doesn't reliably shrink back down even after
      // content is removed. Measuring the React root's own rendered box is accurate
      // and always current; body/documentElement scrollHeight are only fallbacks for
      // the (unlikely) case #root isn't in the DOM yet.
      const height =
        root?.getBoundingClientRect().height ||
        document.body.scrollHeight ||
        document.documentElement.scrollHeight;
      sendResize(Math.ceil(height));
    };

    // Send once immediately in case 'load' already fired before this effect ran.
    sendHeightToParent();

    // 1. Standard lifecycle triggers
    window.addEventListener('load', sendHeightToParent);
    window.addEventListener('resize', sendHeightToParent);

    // 2. On-demand trigger: if parent requests the height, send it immediately
    const handleParentPing = (event: MessageEvent) => {
      if (event.data?.type === 'ask-for-height') {
        sendHeightToParent();
      }
    };
    window.addEventListener('message', handleParentPing);

    // 3. Track every layout size change to our content. A MutationObserver only
    // catches DOM structure changes (nodes added/removed) — it misses a <video>
    // reflowing once its metadata finishes loading, an image finishing download, or
    // a web font swapping in. Those aren't DOM mutations, just later layout passes,
    // which is exactly why the reported height sometimes lagged behind what actually
    // rendered. ResizeObserver watches the box size itself, so it catches all of it.
    let resizeObserver: ResizeObserver | null = null;
    if (root && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => sendHeightToParent());
      resizeObserver.observe(root);
    }

    return () => {
      window.removeEventListener('load', sendHeightToParent);
      window.removeEventListener('resize', sendHeightToParent);
      window.removeEventListener('message', handleParentPing);
      resizeObserver?.disconnect();
    };
  }, []);
}
