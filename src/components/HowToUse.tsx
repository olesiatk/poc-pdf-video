interface HowToUseProps {
  onStartTour: () => void;
}

export function HowToUse({ onStartTour }: HowToUseProps) {
  return (
    <aside className="app__howto">
      <div className="app__howto-title-row">
        <h2>How to use</h2>
        <button
          type="button"
          className="app__tour-btn"
          onClick={onStartTour}
          aria-label="Show a guided tour"
        >
          ?
        </button>
      </div>

      <ol className="app__howto-list">
        <li>
          <strong>Upload a file</strong> using the drop area, or click "Add file" to browse your
          device.
        </li>
        <li>
          <strong>Click a file</strong> in the library to preview it inline.
        </li>
        <li>
          <strong>Double-click a file</strong>, or use the ⤢ button, to open it in a fullscreen
          modal.
        </li>
      </ol>

      <p className="app__howto-note">
        <strong>Restrictions and limitations:</strong> Video and PDF files only. Everything runs
        locally in your browser — nothing is uploaded anywhere, and files are cleared when you
        refresh the page.
      </p>
    </aside>
  );
}
