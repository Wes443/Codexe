import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Authorization } from './auth/Authorization'
import App from './App.jsx'

//for testing
console.log("Root render");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authorization>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Authorization>
  </StrictMode>
)
