// Se importa React para poder usar componentes y JSX
import React from "react";

/**
 * Componente ButtonSubmit
 *
 * Este es un botón reutilizable pensado para formularios.
 * Permite mantener un estilo y comportamiento uniforme
 * en todas las partes de la aplicación donde se necesite
 * un botón para enviar datos.
 *
 * Parámetros (props):
 *  - text: texto que se mostrará dentro del botón.
 *  - onClick: función que se ejecutará cuando el usuario haga click.
 *  - className: clases adicionales para aplicar estilos personalizados.
 */
export const ButtonSubmit = ({ text, onClick, className = "" }) => {
  return (
    <button
      // Función que se ejecuta cuando se hace click
      onClick={onClick}

      // Clases opcionales para los estilos del botón
      className={className}
    >
      {/* Texto que aparece dentro del botón */}
      {text}
    </button>
  );
};
