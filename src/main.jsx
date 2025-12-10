// Ruta: src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// 1) CSS de Bootstrap (ya lo tenías)
import 'bootstrap/dist/css/bootstrap.min.css'

// 2) JS de Bootstrap (necesario para dropdown/collapse del navbar)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 3) (opcional) tu global; el CSS específico de la página lo importamos en Principal.jsx
import './styles/Style.css'
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)