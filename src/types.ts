export type MediaKind = 'video' | 'pdf' | 'image';

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  kind: MediaKind;
  mimeType: string;
  url: string;
  addedAt: number;
}
