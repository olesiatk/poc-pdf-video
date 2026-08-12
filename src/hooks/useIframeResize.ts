import { useLayoutEffect } from 'react';
import { sendResize } from '../postMessage';

export function useIframeResize() {
  // useLayoutEffect (not useEffect) so the first measurement happens before the
  // browser paints, rather than one frame after — the earlier it fires, the less
  // often the parent iframe visibly starts at the wrong size.
  useLayoutEffect(() => {
    const sendHeightToParent = () => {
      // document.documentElement.scrollHeight can get "stuck" at the tallest height
      // the page has ever reached — it doesn't reliably shrink back down even after
      // content is removed. Measuring the React root's own rendered box is accurate
      // and always current; body/documentElement scrollHeight are only fallbacks for
      // the (unlikely) case #root isn't in the DOM yet.
      const root = document.getElementById('root');
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

    // 3. Track dynamic DOM updates
    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(sendHeightToParent);
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true, // catch text-only content changes (no element added/removed)
        attributes: false, // Keep false to prevent infinite layout recalculation loops
      });
    }

    return () => {
      window.removeEventListener('load', sendHeightToParent);
      window.removeEventListener('resize', sendHeightToParent);
      window.removeEventListener('message', handleParentPing);
      observer?.disconnect();
    };
  }, []);
}
