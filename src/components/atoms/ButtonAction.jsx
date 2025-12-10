// Se importa React para poder usar JSX y componentes
import React from "react";

// Se importa el archivo CSS que contiene los estilos del botón
import "../../styles/buttonAction.css";

/**
 * Componente ButtonAction
 *
 * Este componente representa un botón reutilizable.
 * Permite cambiar el texto, el estilo y la función que se ejecuta
 * cuando el usuario hace click.
 *
 * Parámetros (props):
 *  - text: texto que se mostrará dentro del botón.
 *  - onClick: función que se ejecuta al hacer click.
 *  - variant: tipo o estilo del botón (por ejemplo: "success", "danger", etc.).
 *  - className: clases adicionales para aplicar estilos personalizados.
 *  - disabled: indica si el botón debe estar deshabilitado.
 *
 * El botón sirve para acciones como “enviar”, “descargar”, “volver”, etc.
 */
export const ButtonAction = ({ text, onClick, variant, className, disabled }) => {
  return (
    <button
      // className permite agregar estilos externos o personalizados
      className={className}

      // Si el botón NO está deshabilitado, ejecuta onClick
      // Si está deshabilitado, no ejecuta nada
      onClick={!disabled ? onClick : undefined}

      // Prop interna de HTML para bloquear el botón
      disabled={disabled}

      // variant se asigna como atributo del botón,
      // sirve si en el CSS usas selectores basados en este atributo
      variant={variant}
    >
      {/* Aquí se muestra el texto dentro del botón */}
      {text}
    </button>
  );
};
