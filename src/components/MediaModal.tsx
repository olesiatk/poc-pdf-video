import { Modal } from './Modal';
import type { MediaFile } from '../types';

interface MediaModalProps {
  file: MediaFile;
  onClose: () => void;
}

export function MediaModal({ file, onClose }: MediaModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className={`media-modal media-modal--${file.kind}`}>
        <div className="media-modal__header">
          <span className={`file-list__badge file-list__badge--${file.kind}`}>
            {file.kind === 'pdf' ? 'PDF' : 'VID'}
          </span>
          <span className="media-modal__title" title={file.name}>
            {file.name}
          </span>
          <button
            type="button"
            className="media-modal__close"
            aria-label="Close preview"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="media-modal__body">
          {file.kind === 'video' ? (
            <video className="media-modal__video" src={file.url} controls autoPlay />
          ) : (
            <iframe className="media-modal__pdf" src={file.url} title={file.name} />
          )}
        </div>
      </div>
    </Modal>
  );
}
