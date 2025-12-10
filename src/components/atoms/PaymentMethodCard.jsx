// Se importa React para poder usar JSX y componentes
import React from "react";
// Se importan los estilos específicos de esta tarjeta
import "../../styles/paymentMethodCard.css";

/**
 * Componente PaymentMethodCard
 *
 * Este componente representa una tarjeta que muestra un método de pago,
 * por ejemplo: tarjetas bancarias, billeteras digitales, etc.
 *
 * Parámetros (props):
 *  - title: título principal del método de pago.
 *  - subtitle: texto explicativo debajo del título.
 *  - icon: icono visual que representa el método (puede ser un emoji o imagen).
 *  - selected: indica si esta tarjeta está seleccionada por el usuario.
 *  - oncClick: función que se ejecuta cuando se hace click en la tarjeta.
 *
 * La tarjeta cambia de estilo cuando está seleccionada,
 * agregando la clase "selected".
 */
export const PaymentMethodCard = ({
  title,
  subtitle,
  icon,
  selected,
  oncClick, // Nota: aquí hay un error tipográfico en el nombre (ver abajo)
}) => {
  return (
    <div
      // Se aplica la clase base y si está seleccionada, se agrega "selected"
      className={`payment-method-card ${selected ? "selected" : ""}`}

      // Se ejecuta la función recibida cuando se hace click
      onClick={oncClick}
    >
      {/* Icono del método de pago */}
      <div className="icon">{icon}</div>

      {/* Contenedor de textos */}
      <div className="text-container">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};
