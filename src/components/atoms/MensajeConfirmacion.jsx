// Se importa React para poder usar componentes y JSX
import React from "react";

/**
 * Componente MensajeConfirmacion
 *
 * Este componente muestra un mensaje de confirmación
 * después de que una compra se realiza correctamente.
 *
 * La descripción indica que debería recibir:
 *  - message: el texto del mensaje a mostrar.
 *  - visible: si debe mostrarse o no.
 *
 *  Siempre muestra el mismo texto.
 */
export const MensajeConfirmacion = () => {
  return (
    <div className="mensaje-confirmacion">
      {/* Título principal del mensaje de éxito */}
      <h2>¡Compra realizada con éxito!</h2>

      {/* Texto que explica que se enviará un correo con los detalles */}
      <p>
        Gracias por tu preferencia! Te enviaremos un correo con los detalles de
        tu compra.
      </p>
    </div>
  );
};
