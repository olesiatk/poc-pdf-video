export type MediaKind = 'video' | 'pdf';

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  kind: MediaKind;
  mimeType: string;
  url: string;
  addedAt: number;
}
