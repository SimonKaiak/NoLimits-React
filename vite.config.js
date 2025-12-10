// =========================================
// CONFIGURACIÓN DE VITE
// Archivo: vite.config.js
// =========================================
// Vite es el bundler que se encarga de:
// - Servir el proyecto en desarrollo
// - Compilar y optimizar para producción
// - Manejar hot reload y módulos ES

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// defineConfig ayuda a tener autocompletado y validación
// al configurar Vite.
export default defineConfig({

  // =========================================
  // PLUGINS
  // =========================================
  // Se agrega el plugin oficial de React para Vite.
  // Este plugin permite:
  // - Soporte para JSX
  // - Fast Refresh (recarga instantánea sin perder estado)
  // - Mejor rendimiento en desarrollo
  plugins: [
    react()
  ],

})