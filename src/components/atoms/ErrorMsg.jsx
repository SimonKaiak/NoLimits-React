// Se importa React para poder usar JSX y componentes
import React from "react";

/**
 * Componente ErrorMsg
 *
 * Este componente se usa para mostrar mensajes de error en un formulario.
 * Por ejemplo: "El correo es obligatorio", "Formato inválido", etc.
 *
 * Recibe una sola propiedad:
 *  - message: el texto del mensaje de error que se debe mostrar.
 *
 * Aunque el mensaje esté vacío, el componente igual se muestra.
 * Esto se hace para mantener el diseño ordenado y evitar que los elementos
 * del formulario salten o se muevan cuando aparece o desaparece un error.
 */
export const ErrorMsg = ({ message }) => {
  return (
    <span
      // id para identificar este elemento si más adelante se necesita
      id="errorMsg"

      // Clase que permite aplicar estilos desde el archivo CSS
      className="error-msg"

      // "alert" indica a herramientas de accesibilidad
      // que este texto puede ser importante para el usuario
      role="alert"

      // "polite" hace que los lectores de pantalla lean el mensaje
      // cuando cambie, pero sin interrumpir de forma brusca
      aria-live="polite"
    >
      {/* Aquí se muestra el mensaje recibido.
          Si message tiene texto, se ve.
          Si está vacío, el espacio se mantiene sin texto. */}
      {message}
    </span>
  );
};
