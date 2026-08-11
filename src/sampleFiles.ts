import type { MediaFile } from './types';

// The base path already ends with a trailing slash (e.g. "/" locally, "/poc-pdf-video/" on Pages).
const base = import.meta.env.BASE_URL;

// Set to "false" in the Pages deploy build so this licensed sample never ships to a public URL.
const includeLicensedSamples = import.meta.env.VITE_INCLUDE_LICENSED_SAMPLES !== 'false';

const videoSample: MediaFile = {
  id: 'sample-video-example',
  name: 'video-example.mp4',
  size: 4653690,
  kind: 'video',
  mimeType: 'video/mp4',
  url: `${base}samples/video-example.mp4`,
  addedAt: Date.now(),
};

const licensedPdfSample: MediaFile = {
  id: 'sample-phrasal-verbs-handout',
  name: 'Phrasal verbs handout.pdf',
  size: 269436,
  kind: 'pdf',
  mimeType: 'application/pdf',
  url: `${base}samples/Phrasal verbs handout.pdf`,
  addedAt: Date.now(),
};

export const sampleFiles: MediaFile[] = includeLicensedSamples
  ? [licensedPdfSample, videoSample]
  : [videoSample];
