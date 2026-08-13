import { driver } from 'driver.js';
import { sendTourStatus } from './postMessage';

export function startTour() {
  const tour = driver({
    animate: true,
    overlayColor: '#000',
    overlayOpacity: 0.7,
    stagePadding: 6,
    stageRadius: 0,
    popoverClass: 'leobit-driver-theme',
    prevBtnText: '← Previous',
    nextBtnText: 'Next →',
    doneBtnText: 'Done',
    onDestroyed: () => {
      sendTourStatus(false);
    },
    steps: [
      {
        element: '.app__header h1',
        popover: {
          title: 'Media Viewer',
          description:
            "Upload video and PDF files, preview them inline, or open them in a modal. Let's take a quick look around.",
        },
      },
      {
        element: '.dropzone',
        popover: {
          title: 'Upload a file',
          description: 'Drag & drop a video or PDF here, or click to browse your device.',
        },
      },
      {
        element: '.app__sidebar-title',
        popover: {
          title: 'Your library',
          description:
            'Every file you upload shows up in this list. Click a row to preview it, or use ⤢ to pop it into a modal.',
        },
      },
      {
        element: '.app__content',
        popover: {
          title: 'Preview area',
          description:
            'The selected file plays or renders here. Use the expand button in the corner to open a fullscreen modal view.',
        },
      },
    ],
  });

  sendTourStatus(true);
  tour.drive();
}
