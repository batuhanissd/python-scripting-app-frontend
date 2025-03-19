import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
  // devtoolsda istekler cifter cifter gorunuyor sebebi bu. eger strcitmode kapatilirsa normal bir sekilde calisiyor.
)
