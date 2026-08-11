import type { MediaFile } from '../types';
import { formatBytes, formatDate } from '../utils/file';

interface MediaViewerProps {
  file: MediaFile | null;
  onExpand: () => void;
}

export function MediaViewer({ file, onExpand }: MediaViewerProps) {
  if (!file) {
    return (
      <div className="viewer viewer--empty">
        <p>Select a file from the library, or upload a new one, to preview it here.</p>
      </div>
    );
  }

  return (
    <div className="viewer">
      <div className="viewer__stage">
        {file.kind === 'video' ? (
          <video key={file.id} className="viewer__video" src={file.url} controls />
        ) : (
          <iframe key={file.id} className="viewer__pdf" src={file.url} title={file.name} />
        )}
        <button
          type="button"
          className="viewer__expand"
          onClick={onExpand}
          aria-label="Open in modal"
        >
          ⤢
        </button>
      </div>
      <div className="viewer__meta">
        <h2 className="viewer__title">{file.name}</h2>
        <dl className="viewer__details">
          <div>
            <dt>Type</dt>
            <dd>{file.kind === 'pdf' ? 'PDF document' : 'Video'}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{formatBytes(file.size)}</dd>
          </div>
          <div>
            <dt>Added</dt>
            <dd>{formatDate(file.addedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
