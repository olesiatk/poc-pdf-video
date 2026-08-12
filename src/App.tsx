import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MediaModal } from './components/MediaModal';
import { RouteBridge } from './components/RouteBridge';
import { MainPage } from './pages/MainPage';
import { LibraryPage } from './pages/LibraryPage';
import { useIframeResize } from './hooks/useIframeResize';
import { detectKind } from './utils/file';
import { generateId } from './utils/id';
import { sampleFiles } from './sampleFiles';
import type { MediaFile } from './types';
import './App.css';

export default function App() {
  const [files, setFiles] = useState<MediaFile[]>(() => sampleFiles);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => sampleFiles[0]?.id ?? null,
  );
  const [modalId, setModalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useIframeResize();

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilesAdded(newFiles: File[]) {
    setError(null);
    const added: MediaFile[] = newFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      kind: detectKind(file)!,
      mimeType: file.type,
      url: URL.createObjectURL(file),
      addedAt: Date.now(),
    }));
    setFiles((prev) => [...added, ...prev]);
    setSelectedId(added[0].id);
  }

  function handleRejected(fileName: string) {
    setError(`"${fileName}" is not a supported video or PDF file.`);
  }

  function handleRemove(id: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
    setSelectedId((current) => (current === id ? null : current));
    setModalId((current) => (current === id ? null : current));
  }

  const selectedFile = files.find((f) => f.id === selectedId) ?? null;
  const modalFile = files.find((f) => f.id === modalId) ?? null;

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app">
        <RouteBridge />
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                files={files}
                selectedFile={selectedFile}
                error={error}
                onFilesAdded={handleFilesAdded}
                onRejected={handleRejected}
                onSelect={setSelectedId}
                onPreview={setModalId}
                onRemove={handleRemove}
                onExpand={() => selectedFile && setModalId(selectedFile.id)}
              />
            }
          />
          <Route
            path="/library"
            element={<LibraryPage files={files} onPreview={setModalId} onRemove={handleRemove} />}
          />
        </Routes>

        {modalFile && <MediaModal file={modalFile} onClose={() => setModalId(null)} />}
      </div>
    </BrowserRouter>
  );
}
