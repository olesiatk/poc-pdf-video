import type { MediaFile } from '../types';
import { formatBytes } from '../utils/file';

interface FileListProps {
  files: MediaFile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onRemove: (id: string) => void;
}

export function FileList({ files, selectedId, onSelect, onPreview, onRemove }: FileListProps) {
  if (!files.length) {
    return <p className="file-list__empty">No files uploaded yet.</p>;
  }

  return (
    <ul className="file-list">
      {files.map((file) => (
        <li
          key={file.id}
          className={`file-list__item ${file.id === selectedId ? 'file-list__item--active' : ''}`}
          onClick={() => onSelect(file.id)}
          onDoubleClick={() => onPreview(file.id)}
        >
          <span className={`file-list__badge file-list__badge--${file.kind}`}>
            {file.kind === 'pdf' ? 'PDF' : 'VID'}
          </span>
          <span className="file-list__info">
            <span className="file-list__name" title={file.name}>
              {file.name}
            </span>
            <span className="file-list__size">{formatBytes(file.size)}</span>
          </span>
          <button
            type="button"
            className="file-list__preview"
            aria-label={`Open ${file.name} in modal`}
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file.id);
            }}
          >
            ⤢
          </button>
          <button
            type="button"
            className="file-list__remove"
            aria-label={`Remove ${file.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.id);
            }}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
