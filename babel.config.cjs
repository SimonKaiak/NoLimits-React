// =========================================
// CONFIGURACIÓN DE BABEL
// Archivo: babel.config.cjs
// =========================================
// Babel se encarga de transformar código moderno de JavaScript
// y React a una versión compatible con distintos entornos.

module.exports = {
  presets: [
    // -----------------------------------------
    // @babel/preset-env
    // -----------------------------------------
    // Permite usar JavaScript moderno (ES6+)
    // y lo convierte al formato compatible con
    // la versión de Node.js que se esté usando.
    // 'node: current' indica que usará la versión
    // actual de Node instalada en tu sistema.
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],

    // -----------------------------------------
    // @babel/preset-react
    // -----------------------------------------
    // Habilita la transformación de JSX (React)
    // runtime: 'automatic' permite NO importar React
    // explícitamente en cada archivo JSX.
    // Ejemplo: ya no necesitas -> import React from 'react';
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ]
};