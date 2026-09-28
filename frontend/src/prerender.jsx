import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

export function render(url = '/') {
  return renderToString(
    <React.StrictMode>
      <MemoryRouter initialEntries={[url]}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </React.StrictMode>
  )
}
