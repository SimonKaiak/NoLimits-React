// Se importa React para poder usar JSX y componentes
import React from "react";

// Se importa la tarjeta individual de método de pago
import { PaymentMethodCard } from "../atoms/PaymentMethodCard";

/**
 * Componente PaymentMethodList
 *
 * Este componente muestra una lista de métodos de pago disponibles.
 *
 * No usa el componente PaymentMethodCard directamente para estas dos opciones,
 * sino que arma cada tarjeta de forma manual.
 *
 * Parámetros (props):
 *  - selected: método de pago actualmente seleccionado por el usuario.
 *  - onSelect: función que se ejecuta cuando el usuario selecciona un método.
 *
 * Métodos disponibles:
 *  - "tarjetas": crédito, débito, prepago.
 *  - "onepay": billeteras digitales.
 */
export const PaymentMethodList = ({ selected, onSelect }) => {
  return (
    <>
      {/* Título de la categoría */}
      <p className="metodo-titulo">Tarjetas</p>

      {/* Tarjeta para método "tarjetas" */}
      <div
        // data-testid sirve para pruebas automatizadas
        data-testid="btn-tarjetas"

        // Si selected es "tarjetas", se agrega la clase "selected"
        className={`payment-method-card ${
          selected === "tarjetas" ? "selected" : ""
        }`}

        // Al hacer click, notifica al componente padre cuál método se eligió
        onClick={() => onSelect("tarjetas")}
      >
        <span className="icon">💳</span>
        Crédito, Débito, Prepago
      </div>

      {/* Segunda categoría */}
      <p className="metodo-titulo">OnePay</p>

      {/* Tarjeta para método "onepay" */}
      <div
        data-testid="btn-onepay"
        className={`payment-method-card ${
          selected === "onepay" ? "selected" : ""
        }`}
        onClick={() => onSelect("onepay")}
      >
        <span className="icon">📱</span>
        Otras billeteras digitales
      </div>
    </>
  );
};
