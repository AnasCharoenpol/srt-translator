import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initBackgroundAnimation } from './animations'

// Initialize background animations
initBackgroundAnimation();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
