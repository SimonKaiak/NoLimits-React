// =============================================
// CONFIGURACIÓN DE KARMA PARA TESTING FRONTEND
// Archivo: karma.conf.cjs
// =============================================
// Karma es un test runner que ejecuta pruebas
// en navegadores reales o simulados (ChromeHeadless)
// usando Jasmine como framework de testing.

const webpack = require("webpack");

module.exports = function (config) {
  config.set({

    // ===============================
    // FRAMEWORKS DE TEST
    // ===============================
    // Jasmine es el framework que maneja los test (describe, it, expect, etc.)
    frameworks: ["jasmine"],


    // ===============================
    // ARCHIVOS DE TEST A EJECUTAR
    // ===============================
    // setupTests.js contiene configuraciones globales
    // y todos los archivos *.spec.jsx son los test reales
    files: [
      "src/test/setupTests.js",
      "src/test/**/*.spec.jsx"
    ],


    // ===============================
    // PREPROCESADORES
    // ===============================
    // Se indica que estos archivos deben pasar por Webpack
    // antes de ejecutarse en Karma
    preprocessors: {
      "src/test/setupTests.js": ["webpack"],
      "src/test/**/*.spec.jsx": ["webpack"]
    },


    // ===============================
    // CONFIGURACIÓN DE WEBPACK PARA TEST
    // ===============================
    webpack: {
      mode: "development",

      module: {
        rules: [

          // -----------------------------------------
          // Soporte para JS y JSX usando Babel
          // -----------------------------------------
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react"
                ]
              }
            }
          },

          // -----------------------------------------
          // Soporte para archivos CSS en los test
          // -----------------------------------------
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          },

          // -----------------------------------------
          // Soporte para imágenes
          // Evita errores como: Unexpected character '<'
          // -----------------------------------------
          {
            test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
            type: "asset/resource"
          }
        ]
      },

      // ===============================
      // RESOLUCIÓN DE EXTENSIONES
      // ===============================
      // Permite importar archivos sin escribir la extensión
      resolve: {
        extensions: [".js", ".jsx"]
      },


      // ===============================
      // MOCK PARA import.meta.env
      // ===============================
      // Simula las variables de entorno de Vite
      // y evita errores durante los tests
      plugins: [
        new webpack.DefinePlugin({
          "import.meta.env": JSON.stringify({
            VITE_API_URL: ""
          })
        })
      ]
    },


    // ===============================
    // REPORTES DE RESULTADOS
    // ===============================
    // progress  -> barra de progreso
    // kjhtml    -> interfaz visual de resultados
    // coverage  -> cobertura de código
    reporters: [
      "progress",
      "kjhtml",
      "coverage"
    ],


    // ===============================
    // REPORTE DE COBERTURA
    // ===============================
    coverageReporter: {
      type: "html",        // Genera reporte HTML
      dir: "coverage/"     // Carpeta de salida
    },


    // ===============================
    // CONFIGURACIÓN DE NAVEGADOR
    // ===============================
    browsers: ["ChromeHeadless"],  // Navegador sin interfaz gráfica
    singleRun: true,               // Ejecuta una sola vez y termina
    restartOnFileChange: true,    // Reinicia si cambian archivos


    // ===============================
    // PLUGINS UTILIZADOS POR KARMA
    // ===============================
    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-coverage",
      "karma-jasmine-html-reporter"
    ]

  });
};