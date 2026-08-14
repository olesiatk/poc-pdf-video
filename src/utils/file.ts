import type { MediaKind } from '../types';

export function detectKind(file: File): MediaKind | null {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }
  if (file.type.startsWith('video/')) {
    return 'video';
  }
  if (['image/png', 'image/jpeg'].includes(file.type) || /\.(png|jpe?g)$/i.test(file.name)) {
    return 'image';
  }
  return null;
}

export function mediaKindBadge(kind: MediaKind): string {
  return { pdf: 'PDF', video: 'VID', image: 'IMG' }[kind];
}

export function mediaKindLabel(kind: MediaKind): string {
  return { pdf: 'PDF document', video: 'Video', image: 'Image' }[kind];
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
