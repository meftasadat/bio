import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import { ThemeProvider } from './context/ThemeContext.jsx'

const rootElement = document.getElementById('root')
const appElement = (
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, appElement)
} else {
  ReactDOM.createRoot(rootElement).render(appElement)
}
