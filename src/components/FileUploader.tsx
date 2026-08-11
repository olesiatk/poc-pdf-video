import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { detectKind } from '../utils/file';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  onRejected: (fileName: string) => void;
}

export function FileUploader({ onFilesAdded, onRejected }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFiles(fileList: FileList | null) {
    if (!fileList) return;
    const accepted: File[] = [];
    for (const file of Array.from(fileList)) {
      if (detectKind(file)) {
        accepted.push(file);
      } else {
        onRejected(file.name);
      }
    }
    if (accepted.length) onFilesAdded(accepted);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
    processFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,application/pdf"
        multiple
        hidden
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="dropzone__icon">+</div>
      <div className="dropzone__title">Add file</div>
      <div className="dropzone__hint">Drag & drop or click to browse</div>
      <div className="dropzone__types">Video (MP4, MOV, WEBM...) or PDF</div>
    </div>
  );
}
