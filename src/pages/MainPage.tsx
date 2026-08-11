import { Link } from 'react-router-dom';
import { FileUploader } from '../components/FileUploader';
import { FileList } from '../components/FileList';
import { MediaViewer } from '../components/MediaViewer';
import { HowToUse } from '../components/HowToUse';
import { startTour } from '../tour';
import type { MediaFile } from '../types';

interface MainPageProps {
  files: MediaFile[];
  selectedFile: MediaFile | null;
  error: string | null;
  onFilesAdded: (files: File[]) => void;
  onRejected: (fileName: string) => void;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onRemove: (id: string) => void;
  onExpand: () => void;
}

export function MainPage({
  files,
  selectedFile,
  error,
  onFilesAdded,
  onRejected,
  onSelect,
  onPreview,
  onRemove,
  onExpand,
}: MainPageProps) {
  return (
    <main className="app__layout">
      <HowToUse onStartTour={startTour} />

      <div>
        <div className="app__header">
          <h1>Media Viewer</h1>
        </div>

        <div className="app__workspace">
          <aside className="app__sidebar">
            <FileUploader onFilesAdded={onFilesAdded} onRejected={onRejected} />
            {error && <p className="app__error">{error}</p>}
            <div className="app__sidebar-title-row">
              <h3 className="app__sidebar-title">Library ({files.length})</h3>
              <Link to="/library" className="app__sidebar-link">
                View all →
              </Link>
            </div>
            <FileList
              files={files}
              selectedId={selectedFile?.id ?? null}
              onSelect={onSelect}
              onPreview={onPreview}
              onRemove={onRemove}
            />
          </aside>

          <section className="app__content">
            <MediaViewer file={selectedFile} onExpand={onExpand} />
          </section>
        </div>
      </div>
    </main>
  );
}
