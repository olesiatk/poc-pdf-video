import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'driver.js/dist/driver.css'
import './index.css'
import App from './App.tsx'
import { isEmbedded } from './postMessage.ts'

// Applied synchronously, before React ever mounts/paints — a React effect would run
// after the first paint, leaving a brief window where .app's full-viewport min-height
// is still active. That's enough to poison the very first height measurement sent to
// the parent: an iframe auto-resize handler can only ever grow the iframe from there,
// since our own min-height would never let scrollHeight report smaller than whatever
// height the parent had already set.
document.body.classList.toggle('is-embedded', isEmbedded())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
