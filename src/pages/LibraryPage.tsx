import { Link } from 'react-router-dom';
import type { MediaFile } from '../types';
import { formatBytes, formatDate, mediaKindBadge, mediaKindLabel } from '../utils/file';

interface LibraryPageProps {
  files: MediaFile[];
  onPreview: (id: string) => void;
  onRemove: (id: string) => void;
}

export function LibraryPage({ files, onPreview, onRemove }: LibraryPageProps) {
  return (
    <main className="library-page">
      <Link to="/" className="library-page__back">
        ← Back to main page
      </Link>

      <h1 className="library-page__title">All files ({files.length})</h1>

      {files.length === 0 ? (
        <p className="library-page__empty">No files uploaded yet.</p>
      ) : (
        <table className="library-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Added</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <div className="library-table__name-cell">
                    <span className={`file-list__badge file-list__badge--${file.kind}`}>
                      {mediaKindBadge(file.kind)}
                    </span>
                    <span className="library-table__name" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                </td>
                <td>{mediaKindLabel(file.kind)}</td>
                <td>{formatBytes(file.size)}</td>
                <td>{formatDate(file.addedAt)}</td>
                <td className="library-table__actions">
                  <button
                    type="button"
                    className="library-table__action"
                    onClick={() => onPreview(file.id)}
                    aria-label={`Open ${file.name} in modal`}
                  >
                    ⤢
                  </button>
                  <button
                    type="button"
                    className="library-table__action library-table__action--danger"
                    onClick={() => onRemove(file.id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
