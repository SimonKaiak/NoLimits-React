// Se importa React para poder usar componentes y JSX
import React from "react";

/**
 * Componente InputEmail
 *
 * Este componente representa un campo de texto específico para ingresar
 * un correo electrónico dentro de un formulario.
 *
 * Sirve para que el valor sea controlado desde el componente padre,
 * lo que permite validar, mostrar errores y manejar el contenido del input.
 *
 * Parámetros (props):
 *  - value: el valor actual del campo (proviene del estado del componente padre).
 *  - onChange: función que se ejecuta cada vez que el usuario escribe algo.
 *  - hasError: indica si el campo tiene un error y si debe mostrarse
 *              con estilo de error visual.
 */
export const InputEmail = ({ value, onChange, hasError }) => {
  return (
    <input
      // id único para identificar el input si se necesita desde CSS o JS
      id="email"

      // se declara que el tipo de campo es de correo electrónico
      type="email"

      // texto que aparece cuando el campo está vacío
      placeholder="Ingresa tu correo"

      // indica que este campo es obligatorio dentro del formulario
      required

      // valor actual del input, enviado desde el componente padre
      value={value}

      // función que se ejecuta cuando el usuario escribe en el input
      onChange={onChange}

      // si hasError es true, se aplica la clase "input-error"
      // en caso contrario, no se aplica ningún estilo extra
      className={hasError ? "input-error" : ""}
    />
  );
};
