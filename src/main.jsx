import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TransportProvider } from './context/TransportContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TransportProvider>
      <App />
    </TransportProvider>
  </React.StrictMode>,
)
