import { useEffect } from 'react';
import { sendResize } from '../postMessage';

export function useIframeResize() {
  useEffect(() => {
    const sendHeightToParent = () => {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      sendResize(height);
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
